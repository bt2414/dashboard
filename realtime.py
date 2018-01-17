# author: Alice Ke
# contact: kepu1994@outlook.com
# create: Jan.07.2018
# company: Graphen

import requests
import json
import time
import datetime
import random
from elasticsearch import Elasticsearch

# --------------- example object ----- #
# object = {
# 	"user_name": "alice1",
# 	"department_name": "sfdsf"
# 	"feature_name": "feature1",
# 	"total_events": 10,
# 	"upperbound_weekly_value": 10,
# 	"upperbound_daily_value": 10,
# 	"lowerbound_weekly_value": 10,
# 	"lowerbound_daily_value": 10,
# 	"feature_score": 98,
# 	"overall_score": 50,
# 	"timestamp": datetime.datetime.now()
# }

es = Elasticsearch([{'host': 'localhost', 'port': 9200}])

department_dict = {}
for user_count in range( 1, 101 ):
	department_dict['alice_' + str( user_count )] = 'department_' + str( random.randint(1, 4) )


i = 1
while True:
	bodies = {}
	now = datetime.datetime.now() + datetime.timedelta(hours=5)
	for user_count in range( 1, 101 ):
		department_count = random.randint(1, 4)
		bodies[user_count] = {}
		sum_score = 0
		total_eventss = {}
		upperbound_daily_values = {}
		upperbound_weekly_values = {}
		lowerbound_daily_values = {}
		lowerbound_weekly_values = {}
		feature_scores = {}
		
		for feature_count in range( 1, 11 ):
			total_eventss[feature_count] = random.random() * 100
			upperbound_daily_values[feature_count] = random.random() * 100
			upperbound_weekly_values[feature_count] = random.random() * 100
			lowerbound_daily_values[feature_count] = random.random() * 100
			lowerbound_weekly_values[feature_count] = random.random() * 100
			feature_scores[feature_count] = random.random() * 100
			sum_score = sum_score + feature_scores[feature_count]
		overall_score = sum_score / 10

		for feature_count in range( 1, 11 ):
			bodies[user_count][feature_count] = {
				"user_name": "alice_" + str( user_count ),
				"department_name": department_dict['alice_' + str( user_count )],
				"feature_name": "feature_"+ str( feature_count ),
				"total_events": total_eventss[feature_count],
				"upperbound_daily_value": upperbound_daily_values[feature_count],
				"upperbound_weekly_value": upperbound_weekly_values[feature_count],
				"lowerbound_daily_value": lowerbound_daily_values[feature_count],
				"lowerbound_weekly_value": lowerbound_weekly_values[feature_count],
				"feature_score": feature_scores[feature_count],
				"overall_score": overall_score,
				"timestamp": now
			}
			es.index(index='boc', doc_type='user', id=i, body=bodies[user_count][feature_count])
			i = i + 1
	time.sleep(60)