import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Dropdown, Modal } from 'react-atlas';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import '../node_modules/react-atlas/lib/atlasThemes.min.css';
import NBA from 'nba';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teams: [
        {
          owner: 'Derek Harper',
          name: 'Sex Panthers',
          division: 'East',
          roster: [
            {
              name: 'Karl-Anthony Towns',
              position: 'C',
              team: 'Min'
            }
          ]
        },
        {
          owner: 'Adam Vickerman',
          name: 'Chattanooga Snappers',
          division: 'West',
          roster: [
            {
              name: 'Stephen Curry',
              position: 'PG',
              team: 'GS'
            }
          ]
        }
      ],
      players: [],
      firstTeam: null,
      secondTeam: null,
      statsActive: false,
      statsActivePlayer: {}
    };
  }

  componentDidMount() {
    NBA.stats
      .playerStats()
      .then(response =>
        this.setState({ players: response.leagueDashPlayerStats })
      );
  }

  setTeam = (value, first) => {
    if (first) {
      this.setState({ firstTeam: value });
    } else {
      this.setState({ secondTeam: value });
    }
  };

  getRoster = teamName => {
    const team = this.state.teams.find(x => x.name === teamName);
    return team.roster;
  };

  showPlayerStats = playerName => {
    const player = this.state.players.find(x => x.playerName === playerName);
    console.log(player);
    const playerArray = [];
    playerArray.push(player);
    this.setState({ statsActivePlayer: playerArray, statsActive: true });
  };

  handleToggle = () => {
    console.log('hello');
    this.setState({ statsActive: false });
  };

  render() {
    const teams = this.state.teams.map((team, index) => (
      <li value={team.name} key="{index}">
        {team.name}
      </li>
    ));

    const options = {
      onRowClick: (row, columnIndex, rowIndex) =>
        this.showPlayerStats(row.name),
      onRowDoubleClick: function(row) {
        alert(`You double click row id: ${row.name}`);
      }
    };

    const selectRowProp = {
      mode: 'checkbox'
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
        <div
          style={{
            width: '50%',
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
              <TableHeaderColumn dataField="position">
                Position
              </TableHeaderColumn>
              <TableHeaderColumn dataField="team">Team</TableHeaderColumn>
            </BootstrapTable>
          )}
        </div>
        <div
          style={{
            width: '50%',
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
              <TableHeaderColumn dataField="position">
                Position
              </TableHeaderColumn>
              <TableHeaderColumn dataField="team">Team</TableHeaderColumn>
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
