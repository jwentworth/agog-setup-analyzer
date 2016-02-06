/*jshint quotmark: false */
/*jshint white: false */
/*jshint trailing: false */
/*jshint newcap: false */
/*global React */

/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../interfaces.d.ts"/>
/// <reference path="../libs/react-d3.d.ts" />

import { CardItem } from "../cardItem";
import { About } from "./about"

import { BarChart } from 'react-d3';


interface ISimulationProps {
  setup : ISetupStore;
}

interface ISimulationState {
}

class Simulation extends React.Component<ISimulationProps, ISimulationState> {

  public state : ICardItemState;

  constructor(props : ISimulationProps){
    super(props);
  }

  /**
   * This is a completely optional performance enhancement that you can
   * implement on any React component. If you were to delete this method
   * the app would still work correctly (and still be very performant!), we
   * just use it as an example of how little code it takes to get an order
   * of magnitude performance improvement.
   */
  // public shouldComponentUpdate(nextProps : ICardItemProps, nextState : ICardItemState) {
  //   return false;
  // }


  public render() {
    if (this.props.setup.deck.drawDeck.length == 0){
      return (
        <section className="simulation">
          <section className="example">
            <About />
          </section>
        </section>
      );
    }
    var deck = this.props.setup.deck;

    var i = 0;

    var orderedDeck = deck.displayDeck.sort((c1, c2) => c2.setup_count - c1.setup_count);

    var cardItems = orderedDeck.map((card) => {
      var code = card.code + i;
      i++;
      return (
        <CardItem
          key={code}
          card={card}
          simulations={this.props.setup.simulations}
        />
      );
    });

    var exampleItems = this.props.setup.exampleSetup.draw.map((pos) => {
      i++;

      var card = this.props.setup.deck.drawDeck[pos];
      var code = card.code + i;
      var image = "http://thronesdb.com/" + card.imagesrc;
      var className = "card-container";

      if (this.props.setup.exampleSetup.cards.filter((p) => p == pos).length > 0){
        className += " selected";
      }

      return (
        <div className={className}><img src={image}/></div>
      );
    });

    var cardUsageData = [{"name": "Used Cards",
    "values": [
    ]}];

    for (var i = 0; i < 8; i++){
      cardUsageData[0].values.push({
        "x": i,
        "y":  Math.round(10000*this.props.setup.cardCounts[i] / this.props.setup.simulations)/100
      });
    }

    var goldUsageData = [{"name": "Gold Spent",
    "values": [
    ]}];
    for (var i = 0; i < 9; i++){
      goldUsageData[0].values.push({
        "x": i,
        "y":  Math.round(10000*this.props.setup.goldCounts[i] / this.props.setup.simulations)/100
      });
    }

    var distinctCharData = [{"name": "Distinct Characters",
    "values": [
    ]}];
    for (var i = 0; i < 8; i++){
      distinctCharData[0].values.push({
        "x": i,
        "y":  Math.round(10000*this.props.setup.distinctCharCounts[i] / this.props.setup.simulations)/100
      });
    }

    var cardsUsed = [];
    for (var i = 0; i < 8; i++){
      if (this.props.setup.cardCounts[i] > 0){
        var plural = "";
        if (i != 1){
          plural = "s";
        }
        cardsUsed.push(
          <p>{i} Card{plural} : {Math.round(10000*this.props.setup.cardCounts[i]/this.props.setup.simulations)/100}%</p>
        );
      }
    }

    var goldUsed = [];
    for (var i = 0; i < 9; i++){
      if (this.props.setup.goldCounts[i] > 0){
        var plural = "";
        if (i != 1){
          plural = "s";
        }
        goldUsed.push(
          <p>{i} Gold{plural} : {Math.round(10000*this.props.setup.goldCounts[i]/this.props.setup.simulations)/100}%</p>
        );
      }
    }

    return (
      <section className="simulation">
      <div className="worko-tabs">
        <input className="state" type="radio" title="tab-one" name="tabs-state" id="tab-one" defaultChecked />
        <input className="state" type="radio" title="tab-two" name="tabs-state" id="tab-two" />

        <div className="tabs flex-tabs">
          <label htmlFor="tab-one" id="tab-one-label" className="tab">Setup Stats</label>
          <label htmlFor="tab-two" id="tab-two-label" className="tab">About</label>

           <div id="tab-one-panel" className="panel active">
            <section className="content">
              <section className="example">
                <div>{this.props.setup.deck.drawDeck.length} Cards</div>
                <div>Example:</div>
                <div className="example-container">
                  {exampleItems}
                </div>
              </section>
              <section className="stats">
                <section className="info">
                  <p>Runs: {this.props.setup.simulations}</p>
                  <p>Avg Gold: {Math.round(10000*this.props.setup.goldSetup/this.props.setup.simulations)/10000}</p>
                  <p>Avg Cards: {Math.round(10000*this.props.setup.cardsSetup/this.props.setup.simulations)/10000}</p>

                  <p><span className="tooltip hint--top" data-hint="Percentage of Setups with 2 or less cards set up or only 1 character">
                      Poor Setups:
                    </span> {Math.round(100*this.props.setup.poorSetups/this.props.setup.simulations)}%</p>
                  <p><span className="tooltip hint--top" data-hint="Percentage of Setups with 5 or more cards set up and over 1 character">
                    Great Setups:
                    </span> {Math.round(100*this.props.setup.greatSetups/this.props.setup.simulations)}%</p>
                  <p><strong>Cards Setup:</strong></p>
                  {cardsUsed}
                  <p><strong>Gold Used:</strong></p>
                  {goldUsed}
                </section>
                <section className="charts">
                  <BarChart
                      data={cardUsageData}
                      width={500}
                      height={200}
                      fill={'#3182bd'}
                      title='Cards Used'
                      yAxisLabel='Percent'
                      xAxisLabel='Cards'
                      />
                    <BarChart
                        data={goldUsageData}
                        width={500}
                        height={200}
                        fill={'#3182bd'}
                        title='Gold Used'
                        yAxisLabel='Percent'
                        xAxisLabel='Gold Spent'
                        />
                    <BarChart
                        data={distinctCharData}
                        width={500}
                        height={200}
                        fill={'#3182bd'}
                        title='Characters Out After Setup'
                        yAxisLabel='Percent'
                        xAxisLabel='Distinct Characters'
                        />
                </section>
              </section>
              <section className="deck">
                <ul className="card-list">
                  {cardItems}
                </ul>
              </section>
              </section>
           </div>

           <div id="tab-two-panel" className="panel">
                <About />
            </div>

         </div>
     </div>

      </section>
    );
  }
}

export { Simulation };
