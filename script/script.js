var margin = {t:50,r:125,b:50,l:125};
var width = $('.plot').width() - margin.r - margin.l,
    height = $('.plot').height() - margin.t - margin.b;

var canvas = d3.select('.plot')
    .append('svg')
    .attr('width',width+margin.r+margin.l)
    .attr('height',height + margin.t + margin.b)
    .append('g')
    .attr('class','canvas')
    .attr('transform','translate('+margin.l+','+margin.t+')');

//Scale for the size of the circles
var scaleR = d3.scale.sqrt().domain([5,100]).range([5,120]);

d3.csv('data/olympic_medal_count.csv', parse, dataLoaded);

function dataLoaded(err,rows){
  var top1900 = top5(rows, 1900);

  draw(top1900, 1900);

  //TODO: fill out this function
  $('.btn-group .year').on('click',function(e){
    e.preventDefault();

    var year = $(this).data('year');

    var topTeams = top5(rows, year)

    draw(topTeams, year);
  });
}

function top5(rows, year) {
  var sorted = _.sortBy(rows, year).reverse(),
      result = sorted.slice(0,5);

  console.log(year.toString() + ': ' + _.pluck(result, year))

  return result;
}

function draw(rows, year){
  var topTeams = canvas.selectAll('.team')
    .data(rows, function(d){ return d.country; })

  var teamsEnter = topTeams.enter().append('g'),
      teamsUpdate = topTeams,
      teamsExit = topTeams.exit().remove()

  teamsEnter
    .attr('class', 'team')
    .attr('transform',function(d,i){
      //i ranges from 0 to 4
      return 'translate(' + i*(width/4) + ',' + height/2 + ')';
    })
    .append('circle')
    .attr('r', function(d){
      return scaleR(d[year]);
    })

  teamsEnter
    .append('text')
    .attr('class','medal-count')
    .text(function(d){ return d[year];})
    .attr('text-anchor','middle');

  teamsEnter
    .append('text')
    .attr('class','team-name')
    .text(function(d){ return d.country; })
    .attr('y', function(d){ return scaleR(d[year]+20)})
    .attr('text-anchor','middle')

  teamsUpdate
    .attr('transform',function(d,i){
      //i ranges from 0 to 4
      return 'translate(' + i*(width/4) + ',' + height/2 + ')';
    })
}

function parse(row){
    //@param row is each unparsed row from the dataset
    return {
        country: row['Country'],
        1900: +row['1900'],
        1960: +row['1960'],
        2012: +row['2012']
    };
}
