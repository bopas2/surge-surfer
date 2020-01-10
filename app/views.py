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
import numpy as np
import math
import pandas as pd
import sklearn
from sklearn.ensemble import RandomForestClassifier
import seaborn as sns

import matplotlib

client = Client(config.ACC_SID, config.AUTH_TOKEN)
#recieving_phone_number = '+12166780678'
recieving_phone_number = ''
sending_phone_number = '+19516665806'

matplotlib.use('agg',warn=False, force=True)
from matplotlib import pyplot as plt

#print "Switched to:",matplotlib.get_backend()

@app.route('/', methods=["GET","POST"])
def index():
    check = 0
    error_msg = " "

    if request.method == "POST":
        if request.form['button'] == 'Submit':

            try:
                earliest = ""
                latest = ""
                start = ""
                end = ""
                

                first = request.form['datetimepicker3']
                last = request.form['datetimepicker1']
                

                early = str(dt.date.today()) + " " + first
                earliest = dt.datetime.strptime(early, '%Y-%m-%d %I:%M %p').timestamp()
                late = str(dt.date.today()) + " " + last
                latest = dt.datetime.strptime(late, '%Y-%m-%d %I:%M %p').timestamp()
                start = request.form['startLocation']
                end  = request.form['endLocation']
                recieving_phone_number = request.form['phoneNumber']
                if not start or not end:
                    error_msg = "You must enter your phone number, earliest and latest arrival times, and your start point and final destination."
                    return render_template("index.html", ret = [], length = 0, error = error_msg, early = "", late = "")
            
            except:
                error_msg = "You must enter your phone number, earliest and latest arrival times, and your start point and final destination."
                return render_template("index.html", ret = [], length = 0, error = error_msg, early = "", late = "")
            
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
            
            early_url = url + "&arrival_time=" + str(earliest) + '&key=' + key
            late_url = url + "&arrival_time=" + str(latest) + '&key=' + key

            r = requests.get(early_url)
            print(r.json())
            early_departure_int = earliest-r.json()['rows'][0]['elements'][0]['duration']['value']
            early_departure = time.strftime('%I:%M %p', time.localtime(early_departure_int))

            r = requests.get(late_url)
            late_departure_int = latest-r.json()['rows'][0]['elements'][0]['duration']['value']
            late_departure = time.strftime('%I:%M %p', time.localtime(late_departure_int))

            early_time = time.localtime(early_departure_int)

            rounded_start = math.ceil(early_departure_int/900) * 900
            print(rounded_start, late_departure_int)
            tracker = rounded_start
            time_interval = []
            while tracker <=  late_departure_int:
                time_interval.append(tracker)
                tracker += 900

            mins_interval = [dt.datetime.fromtimestamp(num).minute + dt.datetime.fromtimestamp(num).hour*60 for num in time_interval]
            mins_interval = np.array(mins_interval)
            
            day = dt.datetime.fromtimestamp(rounded_start).day

            data = pd.read_csv("data.csv")
            data = data.drop(labels=["Unnamed: 0", "driver_id", "ride_id", "event", "timestamp", "ride_distance", "ride_duration", "hour"], axis = 1)
            X = data.drop(labels=["ride_prime_time"], axis = 1)
            y = data["ride_prime_time"].astype(bool).astype(int)

            model = RandomForestClassifier(class_weight={0: 1, 1: 1.1}, min_samples_split=480, random_state=0)
            model.fit(X, y)

            data2 = data.loc[data["ride_prime_time"] > 0]
            X2 = data2.drop(labels=["ride_prime_time"], axis=1)
            y2 = data2["ride_prime_time"]

            model2 = RandomForestClassifier(class_weight='balanced', min_samples_leaf=10, min_samples_split=148, random_state=0)
            model2.fit(X2, y2)

            def predict(day, intervals):
                y_pred = []
                for interval in intervals:
                    param = np.array([day, interval]).reshape(1, -1)
                    y_pred.append(model.predict(param)[0])
                surge_pred = []
                for i in range(len(intervals)):
                    if y_pred[i]:
                        param = np.array([day, intervals[i]]).reshape(1, -1)
                        surge_pred.append(model2.predict(param)[0])
                    else:
                        surge_pred.append(0)
                return surge_pred

            preds=predict(day, mins_interval)
            print(preds)

            tup_data = list(zip(time_interval, preds))
            tup_data.sort(key = lambda x: (x[1], x[0]))
            print(tup_data)

            try:
                ret = tup_data[0:3]
            except:
                ret = tup_data

            plt.cla()
            plt.clf()
            plt.figure()
            time_list = [time.strftime('%I:%M %p', time.localtime(num)) for num in time_interval]
            sns.set(style="dark", rc={"lines.linewidth": 4.5})
            sns.set_palette("GnBu_d", 3)
            plt.rcParams["font.family"] = "Helvetica"
            # Plot the responses for different events and regions
            ax = sns.lineplot(x=time_list, y=preds) # edit this line with data and vars
            ax.set_yticks([])
            ax.set(xlabel='Time', ylabel='Surge', title = "When should you ride?")
            plt.savefig('static/graph.png')
            ret = [time for time, surge in ret]
            print(ret)
            #ret = [str(dt.datetime.fromtimestamp(num).hour) + ':' + str(dt.datetime.fromtimestamp(num).minute) for num in ret]
            ret = [time.strftime('%I:%M %p', time.localtime(num)) for num in ret]
            print(ret)
            try:
                message = client.messages \
                    .create(
                        body= "leave after " + early_departure + " by " + late_departure,
                        from_=sending_phone_number,
                        to=recieving_phone_number
                    )
            except:
                error_msg = "Unable to send text message with details to " + recieving_phone_number
                return render_template("index.html", ret = [], length = 0, error = error_msg, early = early_departure, late = late_departure)
            return render_template("index.html", ret = ret, length = len(ret), error = "", early = early_departure, late = late_departure)
            print(message.sid)
        else:
            return render_template("index.html", ret = [], length = 0, error = "", early = "", late = "")

    return render_template("index.html", ret = [], length = 0, error = "", early = "", late = "")