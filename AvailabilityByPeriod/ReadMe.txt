AvailabilityStatsPlugin

 Example of using plugin:
  $('#availability').AvailabilityStatsPlugin(
    {
		'jsonData': availabilityStats,  // availability Stats data
        'dangerColor': 'red',           // color if some value less then minAvailability
        'infoColor': 'blue',            // color if some value larger then minAvailability
        'minAvailability': '91.5'       // min value of Availability
    });

	 Source files:

 ~/Scripts/AvailabilityStatsPlugin.js
 ~/Content/AvailabilityStatsPlugin.css

 Requires
	 jquery
	 d3.js
	 bootstrap


