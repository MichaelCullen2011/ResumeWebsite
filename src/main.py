from flask import Flask, render_template, request, send_from_directory
from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SubmitField
from flask_mail import Mail, Message
import os


app = Flask(__name__, static_url_path="/static")
app.config['SECRET_KEY'] = os.urandom(32)
app.config['MAIL_SERVER'] = 'smtp.googlemail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'swiftyblaze@gmail.com'  # enter your email here
app.config['MAIL_DEFAULT_SENDER'] = 'swiftyblaze@gmail.com' # enter your email here
app.config['MAIL_PASSWORD'] = 'xultxpjkxxppydyb' # enter your password here

mail = Mail(app)

@app.route('/')
def home():
	return render_template("homepage.html")


@app.route('/contact', methods=["GET","POST"])
def get_contact():
	form = EmailForm()
	if request.method == 'POST':
		name =  request.form["Name"]
		email = request.form["Email"]
		message = request.form["Message"]
		subject = str(name + " sent an email from " + email)
		print(subject)
		msg = Message(subject, sender=email, recipients=['michaelcullen2011@hotmail.co.uk'])
		msg.body = message
		mail.send(msg)
		return render_template('contact_sent.html', form=form)
	else:
		return render_template('contact.html', form=form)


class EmailForm(FlaskForm):
    name = StringField("Name")
    email = StringField("Email")
    subject = StringField("Subject")
    message = TextAreaField("Message")
    submit = SubmitField("Send")

@app.route('/cv')
def cv_view():
    return render_template("cv.html")

@app.route('/tableau1')
def tableau1_view():
    return render_template("tableau1.html")

@app.route('/tableau2')
def tableau2_view():
    return render_template("tableau2.html")

@app.route('/qc_neutrino_paper')
def paper_view():
	try:
		return send_from_directory("static/", "QC_Paper.pdf")
	except FileNotFoundError:
		return "Not Found"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
