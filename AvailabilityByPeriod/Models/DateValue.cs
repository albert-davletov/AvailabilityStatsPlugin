using System;
using System.Collections.Generic;

namespace AvailabilityByPeriod.Models
{
    public class DateValue
    {
        public DateTime date { get; set; }
        public List<HourValue> valueByHour { get; set; }
        
    }
}