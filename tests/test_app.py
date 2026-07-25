import os
import unittest
from unittest.mock import patch


# Keep application import independent from a developer's local credentials.
os.environ["SECRET_KEY"] = "release-check-test-secret"
os.environ["MAIL_USERNAME"] = "release-check@example.com"
os.environ["MAIL_DEFAULT_SENDER"] = "release-check@example.com"
os.environ["MAIL_PASSWORD"] = "release-check-password"

from src.main import app


class ApplicationReleaseChecks(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        app.config.update(
            TESTING=True,
            WTF_CSRF_ENABLED=False,
        )

    def setUp(self):
        self.client = app.test_client()

    def test_public_html_routes_render_html(self):
        routes = ("/", "/architecture", "/physics", "/cv", "/contact")

        for route in routes:
            with self.subTest(route=route):
                response = self.client.get(route)

                self.assertEqual(response.status_code, 200)
                self.assertTrue(response.content_type.startswith("text/html"))

    def test_thesis_pdf_is_available(self):
        response = self.client.get("/qc_neutrino_paper")
        try:
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.content_type, "application/pdf")
            self.assertTrue(response.data.startswith(b"%PDF"))
        finally:
            response.close()

    def test_required_static_assets_are_available(self):
        assets = (
            "css/style.css",
            "js/hero.js",
            "js/nav.js",
            "js/physics.js",
            "favicon.svg",
            "og-image.png",
            "Michael_Cullen_Headshot.jpg",
        )

        for asset in assets:
            with self.subTest(asset=asset):
                response = self.client.get(f"/static/{asset}")
                try:
                    self.assertEqual(response.status_code, 200)
                    self.assertTrue(response.data)
                finally:
                    response.close()

    def test_missing_route_uses_custom_404(self):
        response = self.client.get("/does-not-exist")

        self.assertEqual(response.status_code, 404)
        self.assertTrue(response.content_type.startswith("text/html"))
        self.assertIn(b"That page is not here.", response.data)

    def test_shared_accessibility_contract_is_present(self):
        routes = ("/", "/architecture", "/physics", "/cv", "/contact", "/does-not-exist")

        for route in routes:
            with self.subTest(route=route):
                response = self.client.get(route)
                try:
                    body = response.get_data(as_text=True)

                    self.assertIn('class="skip-link"', body)
                    self.assertIn('href="#main-content"', body)
                    self.assertIn('<main id="main-content" tabindex="-1">', body)
                    self.assertIn('aria-label="Primary navigation"', body)
                    self.assertIn('aria-controls="nav-links"', body)
                    self.assertIn('aria-expanded="false"', body)
                    self.assertEqual(body.count("<main"), 1)
                finally:
                    response.close()

        stylesheet_response = self.client.get("/static/css/style.css")
        try:
            stylesheet = stylesheet_response.get_data(as_text=True)
        finally:
            stylesheet_response.close()
        self.assertIn(":focus-visible", stylesheet)
        self.assertIn("prefers-reduced-motion: reduce", stylesheet)

    def test_architecture_page_omits_public_safe_extraction_notice(self):
        response = self.client.get("/architecture")
        try:
            body = response.get_data(as_text=True)

            self.assertNotIn("Public-safe extraction", body)
            self.assertNotIn("representative reconstructions", body)
        finally:
            response.close()

    def test_architecture_page_names_tables_and_hides_decorative_icons(self):
        response = self.client.get("/architecture")
        try:
            body = response.get_data(as_text=True)

            self.assertIn(
                '<table aria-labelledby="catalogue-heading">',
                body,
            )
            self.assertIn(
                '<table aria-labelledby="evaluation-heading">',
                body,
            )
            self.assertIn(
                '<i class="fa-regular fa-file-lines" aria-hidden="true">',
                body,
            )
            self.assertIn(
                '<i class="fa-regular fa-square-check" aria-hidden="true">',
                body,
            )
            self.assertIn(
                '<i class="fa-regular fa-user" aria-hidden="true">',
                body,
            )
        finally:
            response.close()

    def test_architecture_page_labels_examples_and_repeated_runs_clearly(self):
        response = self.client.get("/architecture")
        try:
            body = response.get_data(as_text=True)

            self.assertIn("Illustrative workflow traces", body)
            self.assertIn("16/16 passed across five runs", body)
            self.assertNotIn("Representative execution traces", body)
            self.assertNotIn("pass⁵", body)
        finally:
            response.close()

    def test_homepage_distinguishes_case_study_from_interactive_demo(self):
        response = self.client.get("/")
        try:
            body = response.get_data(as_text=True)

            self.assertIn('<span class="project-tag">Case Study</span>', body)
            self.assertEqual(body.count('<span class="project-tag">Interactive Demo</span>'), 1)
        finally:
            response.close()

    def test_valid_contact_submission_renders_success(self):
        form_data = {
            "name": "Release Check Visitor",
            "email": "visitor@example.com",
            "message": "A valid release-check message.",
        }

        with patch("src.main.mail.send") as send:
            response = self.client.post("/contact", data=form_data)

        send.assert_called_once()
        sent_message = send.call_args.args[0]
        self.assertEqual(
            sent_message.subject,
            "Release Check Visitor sent a message via the contact form",
        )
        self.assertEqual(sent_message.sender, "release-check@example.com")
        self.assertEqual(sent_message.recipients, ["michaelcullen2024@gmail.com"])
        self.assertEqual(sent_message.reply_to, form_data["email"])
        self.assertEqual(sent_message.body, form_data["message"])
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.content_type.startswith("text/html"))
        self.assertIn(b"Message sent.", response.data)

    def test_contact_mail_failure_returns_fallback_and_preserves_values(self):
        form_data = {
            "name": "Failure Check Visitor",
            "email": "failure@example.com",
            "message": "Please preserve this submitted message.",
        }

        with patch("src.main.mail.send", side_effect=RuntimeError("synthetic failure")):
            response = self.client.post("/contact", data=form_data)

        body = response.get_data(as_text=True)
        self.assertEqual(response.status_code, 503)
        self.assertTrue(response.content_type.startswith("text/html"))
        self.assertIn("michaelcullen2024@gmail.com", body)
        self.assertIn(form_data["name"], body)
        self.assertIn(form_data["email"], body)
        self.assertIn(form_data["message"], body)


if __name__ == "__main__":
    unittest.main()
