from flask import render_template, request
from twilio.rest import Client
from app import app

import config
import requests
import json
import geocoder
import datetime as dt
from datetime import datetime
import time

client = Client(config.ACC_SID, config.AUTH_TOKEN)
recieving_phone_number = '+12166780678'
sending_phone_number = '+19516665806'

@app.route('/', methods=["GET","POST"])
def index():
    if request.method == "POST":
        if request.form['button'] == 'Submit':

            first = request.form['datetimepicker3']
            last = str(request.form['datetimepicker1'])

            #get current longitude and latitude
            g = geocoder.ip('me')
            curr_loc=g.latlng

            #api key
            key = 'AIzaSyDVZ5-R9dw1EFWuzQ8ofHZmqqb4mHiVQfw'

            #url format: url/json?origin=&destination=&arrival=&apikey=

            url = 'https://maps.googleapis.com/maps/api/distancematrix/json?'
            origin_str = str(curr_loc[0]) + "," + str(curr_loc[1])

            url += 'origins=' + origin_str
            #print(url)

            destinations = '13813 Saratoga Vista Ave'
            #destinations = '38.953,-77.2295'
            destinations = '+'.join(destinations.split(' ')) #convert to url format

            url += '&destinations=' + destinations 

            #window gives 2 date time objects

            #earliest = early.timestamp()
            #latest = late.timestamp()

            #earliest = datetime.strptime(first, "%I:%M %p")
            #latest = datetime.strptime(last, "%I:%M %p")

            #print(str(datetime.now().year) + " " + str(datetime.now().month) + " " + str(datetime.now().day) + " " + first)
            early = str(dt.date.today()) + " " + first
            earliest = dt.datetime.strptime(early, '%Y-%m-%d %I:%M %p').timestamp()

            late = str(dt.date.today()) + " " + last
            latest = dt.datetime.strptime(late, '%Y-%m-%d %I:%M %p').timestamp()

            

            print(str(earliest))
            print(str(latest))
            
            early_url = url + "&arrival_time=" + str(earliest) + '&key=' + key
            late_url = url + "&arrival_time=" + str(latest) + '&key=' + key

            r = requests.get(early_url)
            early_departure = earliest-r.json()['rows'][0]['elements'][0]['duration']['value']
            early_departure = time.strftime('%I:%M %p', time.localtime(early_departure))


            r = requests.get(late_url)
            late_departure = latest-r.json()['rows'][0]['elements'][0]['duration']['value']
            late_departure = time.strftime('%I:%M %p', time.localtime(late_departure))
            
            #print("Leave between " + early_departure + " and " + late_departure)
            message = client.messages \
                .create(
                    body= "leave after " + early_departure + " by " + late_departure,
                    from_=sending_phone_number,
                    to=recieving_phone_number
                )

            print(message.sid)
    return render_template("index.html", error = "")
