from flask import Flask, abort, render_template, request, send_from_directory
from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SubmitField
from wtforms.validators import DataRequired, Email, Length
from flask_mail import Mail, Message
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__, static_url_path="/static")
app.config['SECRET_KEY'] = os.environ['SECRET_KEY']
app.config['MAIL_SERVER'] = 'smtp.googlemail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ['MAIL_USERNAME']
app.config['MAIL_DEFAULT_SENDER'] = os.environ['MAIL_DEFAULT_SENDER']
app.config['MAIL_PASSWORD'] = os.environ['MAIL_PASSWORD']

mail = Mail(app)


class EmailForm(FlaskForm):
    name = StringField("Name", validators=[DataRequired(), Length(max=100)])
    email = StringField("Email", validators=[DataRequired(), Email(), Length(max=200)])
    message = TextAreaField("Message", validators=[DataRequired(), Length(max=5000)])
    submit = SubmitField("Send")


@app.route('/')
def home():
    return render_template("index.html")


@app.route('/contact', methods=["GET", "POST"])
def get_contact():
    form = EmailForm()
    if form.validate_on_submit():
        name = form.name.data
        email = form.email.data
        message = form.message.data
        subject = f"{name} sent a message via the contact form"
        msg = Message(
            subject,
            sender=app.config['MAIL_DEFAULT_SENDER'],
            recipients=['michaelcullen2024@gmail.com'],
            reply_to=email
        )
        msg.body = message
        try:
            mail.send(msg)
        except Exception:
            app.logger.exception("Failed to send contact email")
            abort(500)
        return render_template('contact_sent.html', form=form)
    return render_template('contact.html', form=form)


@app.route('/cv')
def cv_view():
    return render_template("cv.html")


@app.route('/architecture')
def architecture_view():
    return render_template("architecture.html")


@app.route('/physics')
def physics_view():
    return render_template("physics.html")


@app.route('/qc_neutrino_paper')
def paper_view():
    try:
        return send_from_directory("static/", "QC_Paper.pdf")
    except FileNotFoundError:
        abort(404)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
