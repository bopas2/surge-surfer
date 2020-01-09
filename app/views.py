from flask import render_template, request

import requests
import json

from app import app

questionData = None

@app.route('/', methods=["GET","POST"])
def index():
    # if request.method == "POST":
    #     # if we want to submit the form
    #     if request.form['button'] == 'Submit':
    #     # if they clicked the random button instead
    #     elif request.form['button'] == "Random":

    #     else:

    # # GET requests
    # else:
    return render_template("index.html", error = "")
