/* global queue */
/* global d3 */
/* global dc */
/* global crossfilter */


queue()
    //loading file from expenditure.json file
    .defer(d3.json, "data/expenditure.json")
    .await(function(error, expenditureData) {

        let expenditureCrossFilter = crossfilter(expenditureData);

        // setting x-axis of bar chart to be name
        let name_dim = expenditureCrossFilter.dimension(dc.pluck('type_of_educational_institution'));

        // grouping amount spent in a year for each institude
        let total_spend_yearly_for_each_institude = name_dim.group().reduceSum(dc.pluck('expenditure_per_student'));

        //bar chart for amount spent against year per instutude
        dc.barChart("#bar-chart")
            .width(1500)
            .height(450)
            .margins({ top: 10, right: 50, bottom: 30, left: 50 })
            .dimension(name_dim)
            .group(total_spend_yearly_for_each_institude)
            .transitionDuration(250)
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            .xAxisLabel("Type of Institude")
            .yAxisLabel("Amount Spent in 10 Years($)")
            .yAxis().ticks(10)

        // setting x-axis of bar chart to be year for one
        let year_dim = expenditureCrossFilter.dimension(dc.pluck('year'));

        // grouping amount spent in a year
        let total_spend_yearly = year_dim.group().reduceSum(dc.pluck('expenditure_per_student'));
        
        //bar chart for amount spent against year per student
        dc.lineChart("#line-chart")
            .width(750)
            .height(450)
            .margins({ top: 10, right: 50, bottom: 30, left: 50 })
            .dimension(year_dim)
            .group(total_spend_yearly)
            .transitionDuration(250)
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            .xAxisLabel("Year")
            .yAxisLabel("Amount Spent per Year ($)")
            .yAxis().ticks(20)
            
            
  let total_number_primary = year_dim.group().reduceSum(function(d) {
   if (d.type_of_educational_institution == 'Primary Schools') {
    return +d.expenditure_per_student;
   }
   else {
    return 0;
   }
  });
  let total_number_sec = year_dim.group().reduceSum(function(d) {
   if (d.type_of_educational_institution == 'Secondary Schools') {
    return +d.expenditure_per_student;
   }
   else {
    return 0;
   }
  });

  let stackedChart = dc.barChart("#multiple-chart");
  stackedChart
   .width(500)
   .height(500)
   .dimension(year_dim)
   .group(total_number_primary, "Primary")
   .stack(total_number_sec, "Secondary")
   .x(d3.scale.ordinal())
   .xUnits(dc.units.ordinal)
   .legend(dc.legend().x(420).y(0).itemHeight(15).gap(5));
  stackedChart.margins().left = 50;
  stackedChart.margins().right = 100;

        dc.renderAll();
    })
