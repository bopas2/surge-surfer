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
#recieving_phone_number = '+12166780678'
recieving_phone_number = ''
sending_phone_number = '+19516665806'

@app.route('/', methods=["GET","POST"])
def index():
    error_msg = " "
    if request.method == "POST":
        if request.form['button'] == 'Submit':

            #try:
            earliest = ""
            latest = ""
            start = ""
            end = ""
            

            first = request.form['datetimepicker3']

            last = request.form['datetimepicker1']
            

            early = str(dt.date.today()) + " " + first
            

            #earliest = dt.datetime.strptime(early, '%Y-%m-%d %I:%M %p').timestamp()
            earliest = dt.datetime.strptime(early, '%Y-%m-%d %I:%M %p').timestamp()
            error_msg = '1'
            late = str(dt.date.today()) + " " + last
            latest = dt.datetime.strptime(late, '%Y-%m-%d %I:%M %p').timestamp()
            error_msg = '2'
            start = request.form['startLocation']
            error_msg = '3'
            end  = request.form['endLocation']
            error_msg = '4'
            recieving_phone_number = request.form['phoneNumber']
            '''
            except:
                #error_msg = "You must enter your phone number, earliest and latest arrival times, and your final destination."
                return render_template("index.html", error = error_msg, early = "", late = "")
            '''
            #get current longitude and latitude
            if not start:
                g = geocoder.ip('me')
                curr_loc=g.latlng
                origin_str = str(curr_loc[0]) + "," + str(curr_loc[1])
            else:
                origin_str = start

            #api key
            key = 'AIzaSyDVZ5-R9dw1EFWuzQ8ofHZmqqb4mHiVQfw'

            #url format: url/json?origin=&destination=&arrival=&apikey=

            url = 'https://maps.googleapis.com/maps/api/distancematrix/json?'
            #origin_str = str(curr_loc[0]) + "," + str(curr_loc[1])

            url += 'origins=' + origin_str
            #print(url)

            #destinations = '13813 Saratoga Vista Ave'
            #destinations = '38.953,-77.2295'

            destinations = '+'.join(end.split(' ')) #convert to url format

            url += '&destinations=' + destinations 

            #window gives 2 date time objects

            #earliest = early.timestamp()
            #latest = late.timestamp()

            #earliest = datetime.strptime(first, "%I:%M %p")
            #latest = datetime.strptime(last, "%I:%M %p")

            #print(str(datetime.now().year) + " " + str(datetime.now().month) + " " + str(datetime.now().day) + " " + first)
            

            

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
            return render_template("index.html", error = "", early = early_departure, late = late_departure)
            print(message.sid)
        else:
            return render_template("index.html", error = "", early = "", late = "")

    return render_template("index.html", error = "", early = "", late = "")