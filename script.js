//getting data:
fetch(
  'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
)
  .then((response) => response.json())
  .then((response) => {
    createChart(response.map((d) => [setTime(d.Time), d.Year]));

    function setTime(str) {
      return new Date(`2020 01 01 00:${str}`);
    }
  });

const tooltip = document.getElementById('tooltip');

function createChart(data) {
  const w = 1000;
  const h = 500;
  const padding = 60;

  //set svg var
  const svg = d3
    .select('body')
    .append('svg')
    .attr('width', w)
    .attr('height', h);

  const yScale = d3
    .scaleTime()
    .domain([d3.min(data, (d) => d[0]), d3.max(data, (d) => d[0])])
    .range([padding, h - padding]);

  const xScale = d3
    .scaleTime()
    .domain([d3.min(data, (d) => d[1]), d3.max(data, (d) => d[1])])
    .range([padding, w - padding]);

  //d3 formatting
  const timeFormat = d3.timeFormat('%M:%S');
  const yearFormat = d3.format('d');

  //create/set axis
  const xAxis = d3.axisBottom(xScale).tickFormat(yearFormat);
  const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);

  svg
    .append('g')
    .attr('id', 'x-axis')
    .attr('transform', 'translate(0,' + (h - padding) + ')')
    .call(xAxis);

  svg
    .append('g')
    .attr('id', 'y-axis')
    .attr('transform', 'translate(' + padding + ', 0)')
    .call(yAxis);
}
