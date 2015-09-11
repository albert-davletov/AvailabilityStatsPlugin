using System;
using System.Collections.Generic;
using System.Web.Mvc;
using AvailabilityByPeriod.Models;

namespace AvailabilityByPeriod.Controllers
{
    public class DataController : Controller
    {
        /// <summary>
        /// Prepare some random data
        /// </summary>
        /// <returns></returns>
        public ActionResult GetData()
        {
            var data = new List<DateValue>();
            var rnd = new Random();
            var count = rnd.Next(100, 500);
            var today = DateTime.Now;
            for (int i = 0; i < count; i++)
            {
                var item = new DateValue();
                var date = today.AddDays(i*(-1));
                
                item.date = date;
                item.valueByHour = new List<HourValue>();
                for (int j = 1; j < 25; ++j)
                {
                    var minValue = rnd.Next(90, 95);
                    var maxValue = rnd.Next(95,100);
                    var randomVal = GetRandomNumber(minValue, maxValue);
                    var valueForItem = new HourValue
                    {
                        hour = j,
                        value = randomVal
                    };
                    item.valueByHour.Add(valueForItem);
                }
                data.Add(item);
            }
            return Json(data, JsonRequestBehavior.AllowGet);
        }

        private double GetRandomNumber(double minimum, double maximum)
        {
            var random = new Random();
            return random.NextDouble() * (maximum - minimum) + minimum;
        }
    }
}