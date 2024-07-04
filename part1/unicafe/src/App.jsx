import { useState } from 'react'

const Header = ({ title }) => <h1>{title}</h1>;

const Button = ({ onClick, text }) => {
  return (
    <>
      <button onClick={onClick}>{text}</button>
    </>
  );
};

const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
);

const Statistics = ({ counters }) => {
  // dependes on the value of the counters (+1, 0, -1)
  const totalSum = counters.reduce((acc, { counter, value }) => acc + counter * value, 0);

  const average = totalSum / counters.length;

  const positiveProp =
    (100 * counters.find((p) => p.text === "good").counter) / totalSum;

  return (
    <table>
      <tbody>
        {counters.map(({ text, counter }, index) => (
          <StatisticLine key={index} text={text} value={counter} />
        ))}
        <StatisticLine text={"all"} value={totalSum} />
        <StatisticLine text={"average"} value={average} />
        <StatisticLine text={"positive"} value={`${positiveProp} %`} />
      </tbody>
    </table>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => setGood(good + 1);
  const handleNeutralClick = () => setNeutral(neutral + 1);
  const handleBadClick = () => setBad(bad + 1);

  const counters = [
    {
      text: "good",
      counter: good, // value = +1
      value: 1,
    },
    {
      text: "neutral",
      counter: neutral, // value = 0
      value: 0,
    },
    {
      text: "bad",
      counter: bad, // value = -1
      value: -1,
    },
  ];

  return (
    <div>
      <Header title={"give feedback"} />
      <Button text="good" onClick={handleGoodClick} />
      <Button text="neutral" onClick={handleNeutralClick} />
      <Button text="bad" onClick={handleBadClick} />
      <Header title={"statistics"} />
      <Statistics counters={counters} />
    </div>
  );
}

export default App