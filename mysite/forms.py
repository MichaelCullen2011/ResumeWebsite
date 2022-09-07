from django import forms


class ContactForm(forms.Form):
    name = forms.CharField(widget=forms.TextInput(attrs={"class": "w3-input w3-border-thin w3-center"}), required=True)
    email = forms.EmailField(widget=forms.TextInput(attrs={"class": "w3-input w3-border-thin w3-center"}), required=True)
    message = forms.CharField(
        required=True,
        widget=forms.Textarea(attrs={"class": "w3-input w3-border-thin w3-center"}),
    )

    # def __init__(self, *args, **kwargs):
    #     super(ContactForm, self).__init__(*args, **kwargs)
    #     self.fields['contact_name'].label = "Your name:"
    #     self.fields['contact_email'].label = "Your email:"
    #     self.fields['content'].label = "What do you want to say?"


