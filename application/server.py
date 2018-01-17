# author: Alice Ke
# contact: kepu1994@outlook.com
# create: Jan.10.2018
# company: Graphen

from flask import Flask
from flask import request, jsonify
from flask_cors import CORS
import json
import time 
import random
from elasticsearch import Elasticsearch, helpers
from flask import render_template, request
import datetime
import sys

# init prep; resolve cross origin error! helpful
app = Flask(__name__)
CORS(app)

departments = ["department_1", "department_2", "department_3", "department_4"]

es = Elasticsearch([{'host': 'localhost', 'port': 9200}])

# this function gets the related data for the specific user, and send it to treemap.js
# to render the user-specific holtwinters
def get_click_data(user_name):
	# --------- TODO ----------- #
	# search the recent 10 timestamps, total_events, upperbound_weekly_value, upperbound_daily_value
	# lowerbound_weekly_value, lowerbound_daily_value for top 3 features and for that specific user_name.
	# please return the data formatted exacatly the same with function get_holtwinter_data()
	return get_holtwinter_data()

# this function gets the related data for the top-dangerous user, and send it to holtwinter.js
# to render the top-dangerous holtwinters
def get_holtwinter_data():
	# --------- TODO ----------- #
	# return the recent 10 timestamps, total_events, upperbound_weekly_value, upperbound_daily_value
	# lowerbound_weekly_value, lowerbound_daily_value for top 3 features and for the top-dangerous user.
	upperbound_weekly_values = []
	upperbound_daily_values = []
	lowerbound_weekly_values = []
	lowerbound_daily_values = []
	timestamps = []
	total_eventss = []

	timestamp = datetime.datetime.now()
	for i in range( 10 ):
		total_events = random.random() * 100
		upperbound_weekly_value = total_events + random.random()*10
		upperbound_daily_value = total_events + random.random()*10
		lowerbound_weekly_value = total_events - random.random()*10
		lowerbound_daily_value = total_events - random.random()*10
		timestamp = timestamp + datetime.timedelta(minutes=i)
		total_eventss.append(total_events)
		upperbound_weekly_values.append(upperbound_weekly_value)
		upperbound_daily_values.append(upperbound_daily_value)
		lowerbound_weekly_values.append(lowerbound_weekly_value)
		lowerbound_daily_values.append(lowerbound_daily_value)
		timestamps.append(timestamp)


	holtwinter_data1 = {
		"total_eventss": total_eventss,
		"upperbound_weekly_values": upperbound_weekly_values,
		"upperbound_daily_values": upperbound_daily_values,
		"lowerbound_weekly_values": lowerbound_weekly_values,
		"lowerbound_daily_values": lowerbound_daily_values,
		"timestamps": timestamps
	}
	 
	holtwinter_data2 = {
		"total_eventss": total_eventss,
		"upperbound_weekly_values": upperbound_weekly_values,
		"upperbound_daily_values": upperbound_daily_values,
		"lowerbound_weekly_values": lowerbound_weekly_values,
		"lowerbound_daily_values": lowerbound_daily_values,
		"timestamps": timestamps
	}

	holtwinter_data3 = {
		"total_eventss": total_eventss,
		"upperbound_weekly_values": upperbound_weekly_values,
		"upperbound_daily_values": upperbound_daily_values,
		"lowerbound_weekly_values": lowerbound_weekly_values,
		"lowerbound_daily_values": lowerbound_daily_values,
		"timestamps": timestamps
	}

	# this list contains 3 data object used for 3 holtwinter charts
	holtwinter_data = [holtwinter_data1, holtwinter_data2, holtwinter_data3]
	return holtwinter_data

# this function gets the related data for the treemap, and send it to treemap.js
# to render the treemap
def get_treemap_data():
	treemap_data = []
	i = 0
	for deparment in departments:
		# query part 
		treemap_data.append({
			"value": 0,
			"name": deparment,
			"path": "100%",
			"children": []
		})

		# --------- TODO ----------- #
		# search the recent 1 timestamp, user_name, department_name, and overall_score
		department_query = { "query": {
		  "bool":{
			 "must":[ 
			   {
				 "term" :{ "department_name" : deparment }
			   },
			   { "range":{
				  "timestamp": {
					"gte": "now-60s/s",
					"lte": "now"
				}
			  }
			  }
			  ],
			  "filter":{
				"term": {
				  "feature_name.keyword": "feature_10"
				}
		   }
		  }
		}
		}

		res = helpers.scan(es,
			query=department_query,
			index="boc",
			doc_type="user"
		)

		j = 0
		for data in res:
			treemap_data[i]["children"].append(
			{
			  "value":1,
			  "name":data["_source"]["user_name"],
			  "score":data["_source"]["feature_score"],
			  "itemStyle": {
				"normal": {
					"color": "#e1b3d9",
					"colorAlpha": data["_source"]["feature_score"]/ 100 * 1.0
				}
			 }})
			j = j + 1

		treemap_data[i]["value"] = j
		i = i + 1
	return treemap_data

# main page
@app.route('/')
def home():
  return render_template("index.html")

# endpoint communicates with frontend treemap.js 
@app.route('/treemap')
def treemap():
	treemap_data = get_treemap_data()
	return jsonify(treemap_data)

# endpoint communicates with frontend holtwinter.js 
@app.route('/holtwinter')
def holtwinter():
	holtwinter_data = get_holtwinter_data()
	return jsonify(holtwinter_data)

# endpoint communicates with frontend treemap.js 
# it's responsible for showing the user-specific holtwinter when he is click in the treemap
@app.route('/click', methods=['GET', 'POST'] )
def click():
	user_name = request.form["user_name"]
	# for debugging
	# print(user_name, file=sys.stderr)
	click_data = get_click_data(user_name)
	return jsonify(click_data)


if __name__ == '__main__':
  app.run(host='localhost', port=9090)
  # # change this part for demo in BOC
  # app.run(host='0.0.0.0', port=9615)


