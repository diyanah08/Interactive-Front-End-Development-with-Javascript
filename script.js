/* global queue */
/* global d3 */
/* global dc */
/* global crossfilter */


queue()
     //loading file from expenditure.json file
    .defer(d3.json, "data/expenditure.json" )
    .await(function(error, expenditureData){
       
       let expenditureCrossFilter = crossfilter(expenditureData);
       
       // setting x-axis of bar chart to be year
       let name_dim = expenditureCrossFilter.dimension(dc.pluck('year'));
        
        // grouping amount spent in a yea
        let total_spend_yearly = name_dim.group().reduceSum(dc.pluck('expenditure_per_student'));
  

        //bar chart for amount spent against year for one student from primary to university studies
        dc.lineChart("#line-chart")
                      .width(1000)
                      .height(950)
                      .margins({top: 10, right: 50, bottom: 30, left: 50})
                      .dimension(name_dim)
                      .group(total_spend_yearly)
                      .transitionDuration(250)
                      .x(d3.scale.ordinal())
                      .xUnits(dc.units.ordinal)
                      .xAxisLabel("Year")
                      .yAxisLabel("Amount Spent ($)")
                      .yAxis().ticks(10);
        
        dc.renderAll();
    })