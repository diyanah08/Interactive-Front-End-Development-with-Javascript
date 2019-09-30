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
       let year_dim = expenditureCrossFilter.dimension(dc.pluck('year'));
        
        // grouping amount spent in a year
        let total_spend_yearly = year_dim.group().reduceSum(dc.pluck('expenditure_per_student'));
  

        //bar chart for amount spent against year for one student from primary to university studies
        dc.lineChart("#line-chart")
                      .width(1000)
                      .height(950)
                      .margins({top: 10, right: 50, bottom: 30, left: 50})
                      .dimension(year_dim)
                      .group(total_spend_yearly)
                      .transitionDuration(250)
                      .x(d3.scale.ordinal())
                      .xUnits(dc.units.ordinal)
                      .xAxisLabel("Year")
                      .yAxisLabel("Amount Spent for all Institude($)")
                      .yAxis().ticks(30)

                      
        let name_dim = expenditureCrossFilter.dimension(dc.pluck('type_of_educational_institution'));
        let total_spend_yearly_for_each_institude = name_dim.group().reduceSum(dc.pluck('expenditure_per_student'));
        
        dc.barChart("#bar-chart")
              .width(1000)
              .height(950)
              .margins({top: 10, right: 50, bottom: 30, left: 50})
              .dimension(name_dim)
              .group(total_spend_yearly_for_each_institude)
              .transitionDuration(250)
              .x(d3.scale.ordinal())
              .xUnits(dc.units.ordinal)
              .xAxisLabel("Type of Institude")
              .yAxisLabel("Amount Spent in 10 Years($)")
              .yAxis().ticks(10)
        
        dc.renderAll();
    })