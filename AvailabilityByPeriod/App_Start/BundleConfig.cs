using System.Web.Optimization;

namespace AvailabilityByPeriod
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));
            
            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js"));

            bundles.Add(new ScriptBundle("~/bundles/myApp").Include(
                      "~/Scripts/d3.min.js",
                      "~/Scripts/AvailabilityStatsPlugin.js",
                      "~/Scripts/default.js",
                      "~/Scripts/qunit.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/d3.css",
                      "~/Content/AvailabilityStatsPlugin.css",
                      "~/Content/qunit.css"));
        }
    }
}
