import React, { Component } from 'react';
import logo from './logo.svg';
import NBA from 'nba';
import schedule from './data/schedule.js';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Dropdown, Modal, Button } from 'react-atlas';
import '../node_modules/react-atlas/lib/atlasThemes.min.css';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      teams: [],
      rosters: [],
      players: [],
      firstTeam: null,
      firstTeamStats: {},
      secondTeam: null,
      secondTeamStats: {},
      statsActive: false,
      statsActivePlayer: {}
    };
  }

  getPlayerStats = () => {
    var that = this;
    NBA.stats
      .playerStats()
      .then(response =>
        that.setState({ players: response.leagueDashPlayerStats })
      );
  };

  getRosters = () => {
    var that = this;
    fetch(`http://localhost:3001/api/rosters`, {
      accept: 'application/json'
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        let teams = [];
        let parsedRosters = [];
        const dataJSON = JSON.parse(data);
        for (var property in dataJSON) {
          if (dataJSON.hasOwnProperty(property)) {
            let positions = [];
            for (let i = 0; i < property.length; i++) {
              if (property[i].match(/[A-Z]/) != null) {
                positions.push(i);
              }
            }
            var output = [
              property.slice(0, positions[positions.length - 1]),
              ' ',
              property.slice(positions[positions.length - 1])
            ].join('');
            teams.push(output);
            let team = [];
            dataJSON[property].forEach(function(player, pIndex) {
              let playerObject = {};
              const parsedName = player.name.slice(0, player.name.indexOf(','));
              playerObject.name = parsedName.replace('*', '');
              team.push(playerObject);
            });
            parsedRosters[output] = team;
          }
        }
        that.setState({ teams: teams, rosters: parsedRosters }, function() {
          this.getPlayerStats();
        });
      });
  };

  componentDidMount() {
    this.getRosters();
  }

  setTeam = (value, first) => {
    console.log(value);
    if (first) {
      this.setState({ firstTeam: value });
    } else {
      this.setState({ secondTeam: value });
    }
  };

  getRoster = teamName => {
    const team = this.state.rosters[teamName];
    return team;
  };

  showPlayerStats = playerName => {
    const player = this.state.players.find(x => x.playerName === playerName);
    const playerArray = [];
    playerArray.push(player);
    this.setState({ statsActivePlayer: playerArray, statsActive: true });
  };

  handleToggle = () => {
    this.setState({ statsActive: false });
  };

  render() {
    const teams = this.state.teams.map((team, index) => (
      <li value={team} key="{index}">
        {team}
      </li>
    ));

    function updateTeamStats(player, selected, team) {}

    const options = {
      onRowClick: (row, columnIndex, rowIndex) =>
        this.showPlayerStats(row.name),
      onRowDoubleClick: function(row) {
        alert(`You double click row id: ${row.name}`);
      }
    };

    function onRowSelect(row, isSelected, e) {
      let rowStr = '';
      for (const prop in row) {
        rowStr += prop + ': "' + row[prop] + '"';
      }
      alert(`is selected: ${isSelected}, ${rowStr}`);
    }

    const selectRowProp = {
      mode: 'checkbox',
      onSelect: onRowSelect
    };

    return (
      <div
        className="App"
        style={{ margin: 'auto', width: '100%', textAlign: 'center' }}
      >
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        {this.state.firstTeam !== null &&
          this.state.secondTeam !== null && (
            <Button primary style={{ display: 'block', margin: '10px auto' }}>
              Analyze Trade
            </Button>
          )}
        <div
          style={{
            width: '30%',
            margin: '0 auto',
            display: 'inline-block',
            verticalAlign: 'top'
          }}
        >
          <Dropdown
            defaultText="Select One ..."
            customLabel="Select First Team"
            onChange={value => {
              this.setTeam(value, true);
            }}
          >
            {teams}
          </Dropdown>
          <br />
          {this.state.firstTeam !== null && (
            <BootstrapTable
              data={this.getRoster(this.state.firstTeam)}
              options={options}
              selectRow={selectRowProp}
            >
              <TableHeaderColumn dataField="name" isKey={true}>
                Name
              </TableHeaderColumn>
            </BootstrapTable>
          )}
        </div>
        <div
          style={{
            width: '30%',
            margin: '0 auto',
            display: 'inline-block',
            verticalAlign: 'top'
          }}
        >
          <Dropdown
            defaultText="Select One ..."
            customLabel="Select Second Team"
            onChange={value => {
              this.setTeam(value, false);
            }}
          >
            {teams}
          </Dropdown>
          <br />
          {this.state.secondTeam !== null && (
            <BootstrapTable
              data={this.getRoster(this.state.secondTeam)}
              options={options}
              selectRow={selectRowProp}
            >
              <TableHeaderColumn dataField="name" isKey={true}>
                Name
              </TableHeaderColumn>
            </BootstrapTable>
          )}
        </div>
        <Modal
          overlay
          active={this.state.statsActive}
          onOverlayClick={this.handleToggle}
          onEscKeyDown={this.handleToggle}
          title={this.state.statsActivePlayer.playerName}
        >
          <BootstrapTable data={this.state.statsActivePlayer}>
            <TableHeaderColumn dataField="gp" isKey={true}>
              Games
            </TableHeaderColumn>
            <TableHeaderColumn dataField="fgm">FGM</TableHeaderColumn>
            <TableHeaderColumn dataField="fga">FGA</TableHeaderColumn>
            <TableHeaderColumn dataField="fgPct">FG%</TableHeaderColumn>
            <TableHeaderColumn dataField="ftm">FTM</TableHeaderColumn>
            <TableHeaderColumn dataField="fta">FTA</TableHeaderColumn>
            <TableHeaderColumn dataField="ftPct">FT%</TableHeaderColumn>
            <TableHeaderColumn dataField="fG3M">3PM</TableHeaderColumn>
            <TableHeaderColumn dataField="reb">REB</TableHeaderColumn>
            <TableHeaderColumn dataField="ast">AST</TableHeaderColumn>
            <TableHeaderColumn dataField="stl">STL</TableHeaderColumn>
            <TableHeaderColumn dataField="blk">BLK</TableHeaderColumn>
            <TableHeaderColumn dataField="pts">PTS</TableHeaderColumn>
          </BootstrapTable>
        </Modal>
      </div>
    );
  }
}

export default App;
