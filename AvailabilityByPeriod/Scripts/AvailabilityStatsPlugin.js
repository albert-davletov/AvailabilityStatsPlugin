/*!
 * AvailabilityStatsPlugin 1.0
 *
 *  AvailabilityStatsPlugin.js
 *  AvailabilityStatsPlugin.css
 *
 * Example of using plugin:
 *  $('#availability').AvailabilityStatsPlugin(
 *   {
 *		  'jsonData': availabilityStats,  // availability Stats data
 *        'dangerColor': 'red',           // color if some value less then minAvailability
 *        'infoColor': 'blue',            // color if some value larger then minAvailability
 *        'minAvailability': '91.5'       // min value of Availability
 *    });
 *
 *  Requires
 *	 - jquery
 *	 - d3.js
 *	 - bootstrap
 *
 * Availability jquery plugin
 * for display values of Availability
 *
 * Date: 2015-06-21
 * Albert Davletov
 */
(function ($) {

    /*-------private methods----------*/

    /* first initialize of dom elements for plugin */
    var createDomElementsForPlugin = function(divForPlugin, settings) {

        // main Containers
        var contentRow = '<div class="row clearfix" id="content-row">' +
            '<div class="col-xs-12 column">' +
            '<div id="testBlock" class="panel panel-default"></div>' +
            '</div>' +
            '</div>';

        divForPlugin.append(contentRow);

        // header for main panel
        var panelHeading = $('<div/>', {
            'class': 'panel-heading clearfix'
        });
        var leftLink = $('<a/>', {
            href: '#',
            'class': 'pull-left',
            text: 'Availability'
        }).append(
            $('<span/>', {
                'class': 'glyphicon glyphicon-zoom-in',
                'aria-hidden': 'true'
            }));

        var myselect = $('<select/>', { id: 'timeSelect', 'class': 'form-control pull-right' });
        var items = [
            { val: "3h", text: "Last 3 hours" },
            { val: "12h", text: "Last 12 hours" },
            { val: "24h", text: "Last 24 hours" },
            { val: "7d", text: "Last 7 days" },
            { val: "30d", text: "Last 30 days" }
        ];

        $.each(items, function() {
            $('<option/>', {
                val: this.val,
                text: this.text
            }).appendTo(myselect);
        });
        myselect.val('3h');

        panelHeading.append(leftLink);
        panelHeading.append(myselect);

        $('#testBlock').append(panelHeading);

        // body for main panel
        var bodyMainPanel = '<div class="panel-body">' +
            '<div class="row">' +
            '<div id="insideBlock" class="panel panel-default">' +
            '<div class="panel-heading panel-heading-custom">Uptime</div>' +
            '</div>' +
            '</div>' +
            '</div>';

        $('#testBlock').append(bodyMainPanel);

        var insidePanelBody = '<div class="panel-body">' +
            '<div id="rowMiddleValue" class="row"></div>' +
            '<div id="availabilityValues" class="row"></div>' +
            '<div id="chart" class="row">' +
            '<div id="barChart" class="col-md-12 column"></div>' +
            '</div>' +
            '</div>';


        $('#insideBlock').append(insidePanelBody);
        var middleAvailability = $('<div/>', {
            id: 'middleAvailability',
            'class': 'col-md-12 column'
        }).append(
            $('<button/>', {
                id: 'middleValue',
                type: 'button',
                'class': 'btn btn-link',
                'data-toggle': 'tooltip',
                'data-placement': 'right',
                'data-original-title': 'middle value by selected period',
                text: "100"
            }));

        $('#rowMiddleValue').append(middleAvailability);
        $('#middleValue').tooltip();
    };

    /* refresh middleValue */
    var refreshMiddleAvailabilityValue = function (data, settings) {
        var middleVal = 0;
        var count = 0;
        for (var i = 0; i < data.length; i++) {
            var val = parseFloat(data[i]);
            if (val >= 0) {
                ++count;
                middleVal += val;
            }
        }
        middleVal = count > 0 ? middleVal / count : 0;
        $('#middleValue').text(middleVal.toFixed(2));

        var color = settings.infoColor;
        var limitValue = settings.minAvailability;
        if (middleVal < limitValue) {
            color = settings.dangerColor;
        }
        $('#middleValue').css('color', color);
    };

    /* create bar chart - Availability by last 7 days */
    var createBarChartForAvailabilityLast7Days = function (dataArr, settings) {
        var data = sortByDate(dataArr);
        data = data.slice(0, 7); // get first 7 elements for bar chart
        var chartData = addSettingsToArray(data, settings);

        var barWidth = 30;
        var width = (barWidth + 10) * data.length;
        var height = 200;

        var x = d3.scale.linear().domain([0, data.length]).range([0, width]);
        var y = d3.scale.linear().domain([
                0, d3.max(data, function(datum) {
                    var val = +(getMinInArrayOfObjects(datum.valueByHour));
                    return val.toFixed(2);
                })
            ]).
            rangeRound([0, height]);

        // add the canvas to the DOM
        var chart = d3.select("#barChart").
            append("svg:svg").
            attr("width", width).
            attr("height", height + 20);

        chart.selectAll("rect")
            .data(chartData)
            .enter()
            .append("svg:rect")
            .attr("x", function(datum, index) {
                return x(index);
            })
            .attr("y", function(datum) {
                var val = +(getMinInArrayOfObjects(datum.valueByHour));
                return height - y(val);
            })
            .attr("height", function(datum) {
                var val = +(getMinInArrayOfObjects(datum.valueByHour));
                return y(val);
            })
            .attr("width", barWidth)
            .attr("fill", function(datum, i) {
                var val = +(getMinInArrayOfObjects(datum.valueByHour));

                var params = datum.settings;
                var limitValue = +params.minAvailability;
                var color = params.infoColor;
                if (val <= limitValue) {
                    color = params.dangerColor;
                }
                return color;
            });

        chart.selectAll("text").
            data(data).
            enter().
            append("svg:text").
            attr("x", function(datum, index) { return x(index) + barWidth; }).
            attr("y", function(datum) {
                var val = +(getMinInArrayOfObjects(datum.valueByHour));
                return height - y(val);
            }).
            attr("dx", -barWidth / 2).
            attr("dy", "1.2em").
            attr("text-anchor", "middle").
            text(function(datum) {
                var val = +(getMinInArrayOfObjects(datum.valueByHour));
                return val.toFixed(2);
            }).
            attr("fill", "white");

        chart.selectAll("text.yAxis").
            data(data).
            enter().append("svg:text").
            attr("x", function(datum, index) { return x(index) + barWidth; }).
            attr("y", height).
            attr("dx", -barWidth / 2).
            attr("text-anchor", "middle").
            text(function(datum) {
                var val = dateToStr(datum.date);
                return val;
            }).
            attr("transform", "translate(0, 18)").
            attr("class", "yAxis");
    };

    /* show values of Availability by last 3 hours */
    var createAvailabilityByLas3Hours = function (data, settings) {
        var sortArr = sortByDate(data);
        if (sortArr.length > 0) {

            $('#availabilityValues').children().fadeOut(500).promise().then(function () {
                $(this).empty();
            });

            var currentDay = sortArr[0];
            var valuesByDay = currentDay.valueByHour;
            var currentTime = new Date();
            var currentHour = currentTime.getHours() != 0 ? currentTime.getHours() : 24;
            var resultArr = [];

            for (var i = 0; i < 3; i++) {
                var findEl = findInArray(valuesByDay, currentHour);
                var value = findEl.value.toFixed(2);
                resultArr.push(value);

                var color = settings.infoColor;
                var limitValue = settings.minAvailability;
                if (value < limitValue) {
                    color = settings.dangerColor;
                }

                var mydiv = $('<div/>', {
                    'class': 'col-md-4 column'
                });
                var num = i + 1;
                var myBtn = $('<button/>', {
                    id: num + '_hour_Value',
                    'class': 'btn btn-link',
                    type: 'button',
                    text: value,
                    css: {
                        color: color
                    }
                }).appendTo(mydiv);

                $('#availabilityValues').append(mydiv);

                currentHour -= 1;
                if (currentHour < 1) {
                    var prevDay = sortArr[1];
                    valuesByDay = prevDay.valueByHour;
                    currentHour = 24;
                }
            }

            refreshMiddleAvailabilityValue(resultArr, settings);
        } else {
            console.log('createAvailabilityByLas3Hours - no data');
        }
    };

    /* show values of Availability by last <count> hours in table format */
    var createTableOfAvailabilityByLastHours = function (data, count, settings) {
        var sortArr = sortByDate(data);
        if (sortArr.length > 0) {
            $('#availabilityValues').children().fadeOut(500).promise().then(function () {
                $(this).empty();
            });

            var tableTitle = ["Hour", "Value"];
            var mytable = $('<table/>', {
                id: 'timeTable',
                'class': 'table'
            }).append(
                        $('<thead/>'),
                        $('<tfoot/>'),
                        $('<tbody/>')
                    );

            // prepare table
            // table header
            var titleCell = $('<tr/>');
            $.each(tableTitle, function (myIndex, myData) {
                titleCell.append(
                    $('<th/>', {
                        text: myData
                    })
                );
            });
            $("thead", mytable).append(titleCell);

            var currentDay = sortArr[0];
            var valuesByDay = currentDay.valueByHour;
            var currentTime = new Date();
            var currentHour = currentTime.getHours() != 0 ? currentTime.getHours() : 24;
            var resultArr = [];

            for (var i = 0; i < count; i++) {
                var findEl = findInArray(valuesByDay, currentHour);
                var value = findEl.value.toFixed(2);
                resultArr.push(value);

                var color = '';//settings.infoColor;
                var limitValue = settings.minAvailability;
                if (value < limitValue) {
                    color = settings.dangerColor;
                }

                // table row
                var dataCell = $('<tr/>', {
                    css: {
                        'background-color': color
                    }
                });
                dataCell.append(
                    $('<td/>', {
                        text: currentHour + ":00"
                    })
                );
                dataCell.append(
                $('<td/>', {
                    text: value
                })
                );

                $("tbody", mytable).append(dataCell);

                currentHour -= 1;
                if (currentHour < 1) {
                    var prevDay = sortArr[1];
                    valuesByDay = prevDay.valueByHour;
                    currentHour = 24;
                }
            }

            refreshMiddleAvailabilityValue(resultArr, settings);
            $('#availabilityValues').append(mytable);
        } else {
            console.log('createTableOfAvailabilityByLastHours - no data');
        }
    };

    /* show values of Availability by last <count> days in table format */
    /* get minimal value of Availability by each day */
    var createTableOfAvailabilityByLastDays = function (data, count, settings) {
        var sortArr = sortByDate(data);
        if (sortArr.length > 0) {
            $('#availabilityValues').children().fadeOut(500).promise().then(function () {
                $(this).empty();
            });

            var tableTitle = ["Date", "Value"];
            var mytable = $('<table/>', {
                id: 'timeTable',
                'class': 'table'
            }).append(
                        $('<thead/>'),
                        $('<tfoot/>'),
                        $('<tbody/>')
                    );

            // prepare table
            // table header
            var titleCell = $('<tr/>');
            $.each(tableTitle, function (myIndex, myData) {
                titleCell.append(
                    $('<th/>', {
                        text: myData
                    })
                );
            });
            $("thead", mytable).append(titleCell);

            var resultArr = [];

            for (var i = 0; i < count; i++) {
                if (i < sortArr.length) {
                    var currentDay = sortArr[i];
                    var date = currentDay.date;
                    var val = getMinInArrayOfObjects(currentDay.valueByHour);
                    val = val ? val : '-';
                    resultArr.push(val);

                    if (Date.parse(date)) {
                        date = date.getDate() + "/" + date.getMonth();
                    } else {
                        date = '-';
                    }

                    var color = '';//settings.infoColor;
                    var limitValue = settings.minAvailability;
                    if (val < limitValue) {
                        color = settings.dangerColor;
                    }

                    // table row
                    var dataCell = $('<tr/>', {
                        css: {
                            'background-color': color
                        }
                    });
                    dataCell.append(
                        $('<td/>', {
                            text: date
                        })
                    );
                    dataCell.append(
                      $('<td/>', {
                          text: val
                      })
                    );

                    $("tbody", mytable).append(dataCell);
                }
            }

            refreshMiddleAvailabilityValue(resultArr, settings);
            $('#availabilityValues').append(mytable);
        } else {
            console.log('createTableOfAvailabilityByLastDays - no data');
        }
    };

    /* event handler for time type select */
    var timeSelectHandler = function(selectValue, data, settings) {
        switch (selectValue) {
        case '3h':
            createAvailabilityByLas3Hours(data, settings);
            break;
        case '12h':
            createTableOfAvailabilityByLastHours(data, 12, settings);
            break;
        case '24h':
            createTableOfAvailabilityByLastHours(data, 24, settings);
            break;
        case '7d':
            createTableOfAvailabilityByLastDays(data, 7, settings);
            break;
        case '30d':
            createTableOfAvailabilityByLastDays(data, 30, settings);
            break;
        }
    };

    /* helpful function */
    function addSettingsToArray(array, settings) {
	    for(var i=0; i<array.length; ++i) {
		    array[i].settings = settings;
	    }
	    return array;
    }
    function sortByDate(array) {
        var sortArr = array.sort(function(a,b){
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          return new Date(b.date) - new Date(a.date);
        });
        return sortArr;
    }
    function findInArray(array, xElement){
      var arr = $.grep(array, function(n, i){
          return n.hour == xElement;
        }); 
        return arr[0];
    }
    function getMinInArrayOfObjects(myArray) {
      var lowest = Number.POSITIVE_INFINITY;
      for (var i=myArray.length-1; i>=0; i--) {
        var value = myArray[i].value;
        if (value < lowest) lowest = value;
      }
      return lowest.toFixed(2);
    }
    function dateToStr(date) {
      var isValid = Date.parse(date);
      if(isValid) {
        var dateStr = date.getDate() + '/' + date.getMonth();
        return dateStr;
      }
      return 'not valid date';
    }

/* public methods */
var methods = {
     init : function( options ) {
     	
     	return this.each(function() {

	         var defaultSettingsForPlugin = {
	             dangerColor: 'rgba(253, 0, 0, 0.77)',
	             infoColor: '#23527c',
	             minAvailabilityValue : '97'
	         };

	         // default settings for plugin
		    var settings = $.extend( {
		        'dangerColor': defaultSettingsForPlugin.dangerColor,
		        'infoColor' 		 : defaultSettingsForPlugin.infoColor,
		        'minAvailability': defaultSettingsForPlugin.minAvailabilityValue
		    }, options);

		    var $this = $(this),
		    	data = $this.data('AvailabilityStatsPlugin'),
				AvailabilityStatsPlugin = $('<div/>', {
				        id:     'mainContainer',
				        'class':  'container', 
			    	});		    	

		    // if plugin not initialize yet
	         if ( ! data ) {

	             $this.append(AvailabilityStatsPlugin);
	         	// create dom elements
	             createDomElementsForPlugin(AvailabilityStatsPlugin, settings);

				// prepare test data for plugin
	             var dataForPlugin = settings.jsonData;

				// default - show values of Availability by last 3 hours
	             createAvailabilityByLas3Hours(dataForPlugin, settings);

				// create bar chart
				createBarChartForAvailabilityLast7Days(dataForPlugin, settings);

				// event handler
				$('#timeSelect').change(function() {
					var selectValue = this.value;
					timeSelectHandler(selectValue, dataForPlugin, settings);
				});

				$(this).data('AvailabilityStatsPlugin', {
	               target : $this,
	               availabilityStatsPlugin: AvailabilityStatsPlugin
	           });
	         }
	     }); 
     },
     destroy : function( ) {

         return this.each(function () {

             var $this = $(this),
                data = $this.data('AvailabilityStatsPlugin');

             // AvailabilityStatsPlugin namespace for plugin
             $(window).unbind('.AvailabilityStatsPlugin');
             data.AvailabilityStatsPlugin.remove();
             $this.removeData('AvailabilityStatsPlugin');

         });
     }
  };

    $.fn.AvailabilityStatsPlugin = function(method) {

        if (methods[method]) {

            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));

        } else if (typeof method === 'object' || ! method) {

            return methods.init.apply(this, arguments);

        } else {

            $.error('Method  ' + method + ' does not exist for jQuery.AvailabilityStatsPlugin');
        }
    };
})( jQuery );