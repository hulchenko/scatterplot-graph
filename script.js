//getting data:
fetch(
  'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
)
  .then((response) => response.json())
  .then((response) => {
    createChart(
      response.map((d) => [convertTime(d.Time), d.Year, d.Doping, d.Name]) //pulling all of the necessary info
    );

    function convertTime(str) {
      return new Date(`1970 01 01 00:${str}`);
    }
  });

const tooltip = document.getElementById('tooltip');

function createChart(data) {
  const w = 1000;
  const h = 500;
  const padding = 60;
  const radius = 10;

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
    .domain([
      d3.min(data, (d) => new Date(d[1] - 1)), //"-1 and +1" to shift circles right by 1 year, for better visual
      d3.max(data, (d) => new Date(d[1] + 1)),
    ])
    .range([padding, w - padding]);

  //final step, svg/elements create:
  svg
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('data-xvalue', (d) => d[1])
    .attr('data-yvalue', (d) => d[0])
    .attr('cx', (d) => xScale(d[1]))
    .attr('cy', (d) => yScale(d[0]))
    .attr('r', radius)
    .on('mouseover', (d, i) => {
      tooltip.setAttribute('data-year', d[1]);
      tooltip.innerHTML = `
      <b>
      Name: ${d[3]}<br>
      Time: ${d[0].getMinutes()}:${d[0].getSeconds()}<br>
      </b>
      <small>Info: ${d[2] ? d[2] : 'No doping allegations'}<small>
   `;
    })
    .on('mouseout', () => {
      tooltip.innerHTML = `
      <b>
      Name: <br />
      Time: <br />
      </b>
      <small>Info:</small>
    `;
    });

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
