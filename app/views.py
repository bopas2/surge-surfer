from flask import render_template, request
from twilio.rest import Client
from app import app

import config
import requests
import json

client = Client(config.ACC_SID, config.AUTH_TOKEN)
recieving_phone_number = '+12166780678'
sending_phone_number = '+19516665806'

@app.route('/', methods=["GET","POST"])
def index():
    if request.method == "POST":
        if request.form['button'] == 'Submit':
            message = client.messages \
                .create(
                    body='hello!',
                    from_=sending_phone_number,
                    to=recieving_phone_number
                )

            print(message.sid)
    return render_template("index.html", error = "")
