$(document).ready(function () {

    // get data from server and create Availability plugin
    GetAvailabilityStatsData();

    // start unit testing jquery plugin
    $('#startUnitTest').click(startUnitTestBtnClickHandler);
    // end unit testing jquery plugin

});

function GetAvailabilityStatsData() {
    
    $.ajax({
        url: '/Data/GetData',
        type: 'GET',
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            var availabilityStats = prepareAvailabilityStatsValues(data);
            callAvailabilityStatsPlugin(availabilityStats);
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log('not Availability Stats from server');

            // call plugin with test data
            var testAvailabilityStats = prepareTestAvailabilityStatsData();
            callAvailabilityStatsPlugin(testAvailabilityStats);
        }
    });

}

function prepareAvailabilityStatsValues(data) {
    for (var i = 0; i < data.length; i++) {
        var value = data[i].date;
        data[i].date = new Date(parseInt(value.replace("/Date(", "").replace(")/", ""), 10));
    }
    return data;
}

function callAvailabilityStatsPlugin(availabilityStats) {

    // call AvailabilityStatsPlugin
    $('#availability').AvailabilityStatsPlugin({
        'jsonData': availabilityStats,  // availability Stats data
        'dangerColor': 'red',           // color if some value less then minAvailability
        'infoColor': 'blue',            // color if some value larger then minAvailability
        'minAvailability': '91.5'       // min value of Availability
    });

    // for remove this plugin
    //$('#availability').myPlugin('destroy');
}

function prepareTestAvailabilityStatsData() {
    /* test Availability Stats data */
    var testAvailabilityStats = [
        {
            date: new Date(2015, 4, 1), valueByHour: [
            { hour: 1, value: 90 }, { hour: 2, value: 99 }, { hour: 3, value: 87.9 },
            { hour: 4, value: 90 }, { hour: 5, value: 99 }, { hour: 6, value: 87.9 },
            { hour: 7, value: 90 }, { hour: 8, value: 99 }, { hour: 9, value: 87.9 },
            { hour: 10, value: 90 }, { hour: 11, value: 99 }, { hour: 12, value: 87.9 },
            { hour: 13, value: 90 }, { hour: 14, value: 99 }, { hour: 15, value: 87.9 },
            { hour: 16, value: 90 }, { hour: 17, value: 99 }, { hour: 18, value: 87.9 },
            { hour: 19, value: 90 }, { hour: 20, value: 99 }, { hour: 21, value: 87.9 },
            { hour: 22, value: 90 }, { hour: 23, value: 99 }, { hour: 24, value: 87.9 }
            ]
        },
        {
            date: new Date(2015, 4, 2), valueByHour: [
            { hour: 1, value: 90 }, { hour: 2, value: 99 }, { hour: 3, value: 87.9 },
            { hour: 4, value: 90 }, { hour: 5, value: 99 }, { hour: 6, value: 87.9 },
            { hour: 7, value: 90 }, { hour: 8, value: 99 }, { hour: 9, value: 87.9 },
            { hour: 10, value: 90 }, { hour: 11, value: 99 }, { hour: 12, value: 87.9 },
            { hour: 13, value: 90 }, { hour: 14, value: 99 }, { hour: 15, value: 87.9 },
            { hour: 16, value: 90 }, { hour: 17, value: 99 }, { hour: 18, value: 87.9 },
            { hour: 19, value: 90 }, { hour: 20, value: 99 }, { hour: 21, value: 87.9 },
            { hour: 22, value: 90 }, { hour: 23, value: 99 }, { hour: 24, value: 87.9 }
            ]
        },
        {
            date: new Date(2015, 4, 3), valueByHour: [
            { hour: 1, value: 90 }, { hour: 2, value: 99 }, { hour: 3, value: 87.9 },
            { hour: 4, value: 90 }, { hour: 5, value: 99 }, { hour: 6, value: 87.9 },
            { hour: 7, value: 90 }, { hour: 8, value: 99 }, { hour: 9, value: 87.9 },
            { hour: 10, value: 90 }, { hour: 11, value: 99 }, { hour: 12, value: 87.9 },
            { hour: 13, value: 90 }, { hour: 14, value: 99 }, { hour: 15, value: 87.9 },
            { hour: 16, value: 90 }, { hour: 17, value: 99 }, { hour: 18, value: 87.9 },
            { hour: 19, value: 90 }, { hour: 20, value: 99 }, { hour: 21, value: 87.9 },
            { hour: 22, value: 90 }, { hour: 23, value: 99 }, { hour: 24, value: 87.9 }
            ]
        },
        {
            date: new Date(2015, 4, 4), valueByHour: [
            { hour: 1, value: 90 }, { hour: 2, value: 99 }, { hour: 3, value: 87.9 },
            { hour: 4, value: 90 }, { hour: 5, value: 99 }, { hour: 6, value: 87.9 },
            { hour: 7, value: 90 }, { hour: 8, value: 99 }, { hour: 9, value: 87.9 },
            { hour: 10, value: 90 }, { hour: 11, value: 99 }, { hour: 12, value: 87.9 },
            { hour: 13, value: 90 }, { hour: 14, value: 99 }, { hour: 15, value: 87.9 },
            { hour: 16, value: 90 }, { hour: 17, value: 99 }, { hour: 18, value: 87.9 },
            { hour: 19, value: 90 }, { hour: 20, value: 99 }, { hour: 21, value: 87.9 },
            { hour: 22, value: 90 }, { hour: 23, value: 99 }, { hour: 24, value: 87.9 }
            ]
        },
        {
            date: new Date(2015, 4, 5), valueByHour: [
                { hour: 1, value: 90 }, { hour: 2, value: 99 }, { hour: 3, value: 87.9 },
            { hour: 4, value: 90 }, { hour: 5, value: 99 }, { hour: 6, value: 87.9 },
            { hour: 7, value: 90 }, { hour: 8, value: 99 }, { hour: 9, value: 87.9 },
            { hour: 10, value: 90 }, { hour: 11, value: 99 }, { hour: 12, value: 87.9 },
            { hour: 13, value: 90 }, { hour: 14, value: 99 }, { hour: 15, value: 87.9 },
            { hour: 16, value: 90 }, { hour: 17, value: 99 }, { hour: 18, value: 87.9 },
            { hour: 19, value: 90 }, { hour: 20, value: 99 }, { hour: 21, value: 87.9 },
            { hour: 22, value: 90 }, { hour: 23, value: 99 }, { hour: 24, value: 87.9 }
            ]
        },
        {
            date: new Date(2015, 4, 6), valueByHour: [
                { hour: 1, value: 90 }, { hour: 2, value: 99 }, { hour: 3, value: 87.9 },
            { hour: 4, value: 90 }, { hour: 5, value: 99 }, { hour: 6, value: 87.9 },
            { hour: 7, value: 90 }, { hour: 8, value: 99 }, { hour: 9, value: 87.9 },
            { hour: 10, value: 90 }, { hour: 11, value: 99 }, { hour: 12, value: 87.9 },
            { hour: 13, value: 90 }, { hour: 14, value: 99 }, { hour: 15, value: 87.9 },
            { hour: 16, value: 90 }, { hour: 17, value: 99 }, { hour: 18, value: 87.9 },
            { hour: 19, value: 90 }, { hour: 20, value: 99 }, { hour: 21, value: 87.9 },
            { hour: 22, value: 90 }, { hour: 23, value: 99 }, { hour: 24, value: 87.9 }
            ]
        },
        {
            date: new Date(2015, 4, 7), valueByHour: [
                { hour: 1, value: 90 }, { hour: 2, value: 99 }, { hour: 3, value: 87.9 },
            { hour: 4, value: 90 }, { hour: 5, value: 99 }, { hour: 6, value: 87.9 },
            { hour: 7, value: 90 }, { hour: 8, value: 99 }, { hour: 9, value: 87.9 },
            { hour: 10, value: 90 }, { hour: 11, value: 99 }, { hour: 12, value: 87.9 },
            { hour: 13, value: 90 }, { hour: 14, value: 99 }, { hour: 15, value: 87.9 },
            { hour: 16, value: 90 }, { hour: 17, value: 99 }, { hour: 18, value: 87.9 },
            { hour: 19, value: 90 }, { hour: 20, value: 99 }, { hour: 21, value: 87.9 },
            { hour: 22, value: 90 }, { hour: 23, value: 99 }, { hour: 24, value: 87.9 }
            ]
        }
    ];
    return testAvailabilityStats;
}

function startUnitTestBtnClickHandler() {
    $('#unitTestingBlock').show();

    test("Your selector test", function () {
        ok($('#timeSelect').length > 0, "timeSelect exists");
        ok($('#middleValue').length, "middleValue exists");
        ok($('#availabilityValues').length, "availability Values exists");
        ok($('#barChart').length, "bar Chart exists");
    });
}