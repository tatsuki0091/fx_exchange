import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Button, TextField } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { FX_INFO } from './types';

const url = process.env.REACT_APP_FX_API;
export const getStaticProps = async () => {
  const res = await fetch(url);
  const data = await res.json();
  // 取得するデータにidの項目がないので付与
  for (let i = 0; i < Object.keys(data.quotes).length; i++) {
    data.quotes[i].id = i + 1;
    data.quotes[i].currencyPairCode =
      data.quotes[i].currencyPairCode.substr(0, 3) +
      '/' +
      data.quotes[i].currencyPairCode.substr(3, 5);
  }
  return {
    revalidate: 10,
    props: {
      data,
    },
  };
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table: {
      minWidth: 650,
    },
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '33%',
      },
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      width: '100%',
    },
    rate: {},
    button: {
      borderBottom: '5px solid #b84c00',
      textAlign: 'center',
      color: '#fff',
      backgroundColor: '#eb6100',
      '&:hover': {
        marginTop: '3px',
        color: '#fff',
        background: '#f56500',
        borderBottom: '2px solid #b84c00',
      },
    },
    btnShadow: {
      WebkitBoxShadow: '0 3px 5px rgba(0, 0, 0, .3)',
      boxShadow: '0 3px 5px rgba(0, 0, 0, .3)',
    },
  })
);

const Home = (fxInfo: FX_INFO) => {
  const classes = useStyles();

  const [currencyTypeFrom, setCurrencyTypeFrom] = React.useState('');
  const [currencyTypeTo, setCurrencyTypeTo] = React.useState('');
  const [rate, setRate] = React.useState(0);
  const [result, setResult] = React.useState(0);
  const handleChangeFrom = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCurrencyTypeFrom(event.target.value as string);
  };
  const handleChangeTo = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCurrencyTypeTo(event.target.value as string);
  };

  const handleChangeRate = (event: React.ChangeEvent<{ value: unknown }>) => {
    setRate(event.target.value as number);
  };

  const onSubmit = (event: React.ChangeEvent<{ value: unknown }>) => {
    if (currencyTypeFrom === currencyTypeTo) {
      return alert('Please choose defferent currency type');
    }
    const currencyPair = currencyTypeFrom + '/' + currencyTypeTo;
    for (let i = 0; i < Object.keys(fxInfo.data.quotes).length; i++) {
      if (currencyPair === fxInfo.data.quotes[i].currencyPairCode) {
        // 計算
        const calculateReslt = rate * fxInfo.data.quotes[i].ask;
        //　小数点第二位以降の少数を切り捨てのため一度String型に変えてから再度numberに変換
        const res: number = parseFloat(calculateReslt.toFixed(2));
        setResult(res);
      }
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>FX Exchange</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <header className={styles.topHeader}>
          <h1 className={styles.topTitle}>FX Exchange</h1>
          <nav className={styles.nav}>
            <ul className={styles.linkList}>
              <li className={styles.linkWord}>
                <Link href="/">Home</Link>
              </li>
            </ul>
          </nav>
        </header>
        <div className={styles.inputForm}>
          <FormControl className={classes.formControl}>
            <TextField
              className={classes.rate}
              id="standard-basic"
              label="Rate"
              onChange={handleChangeRate}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-helper-label">From</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={currencyTypeFrom}
              onChange={handleChangeFrom}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={'USD'}>USD</MenuItem>
              <MenuItem value={'EUR'}>EUR</MenuItem>
              <MenuItem value={'JPY'}>JPY </MenuItem>
              <MenuItem value={'CAD'}>CAD</MenuItem>
              <MenuItem value={'AUD'}>AUD</MenuItem>
              <MenuItem value={'ZAR'}>ZAR</MenuItem>
              <MenuItem value={'CHF'}>CHF</MenuItem>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-helper-label">To</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={currencyTypeTo}
              onChange={handleChangeTo}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={'USD'}>USD</MenuItem>
              <MenuItem value={'EURO'}>EUR</MenuItem>
              <MenuItem value={'JPY'}>JPY </MenuItem>
              <MenuItem value={'CAD'}>CAD</MenuItem>
              <MenuItem value={'AUD'}>AUD</MenuItem>
              <MenuItem value={'ZAR'}>ZAR</MenuItem>
              <MenuItem value={'CHF'}>CHF</MenuItem>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <Button
              className={`${classes.button} ${classes.btnShadow}`}
              onClick={onSubmit}
            >
              Calculate
            </Button>
          </FormControl>
          <h2 className={styles.result}>Rate</h2>
          <h3 className={styles.result}>{result}</h3>
        </div>
        <div>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>high</TableCell>
                  <TableCell align="right">open</TableCell>
                  <TableCell align="right">bid</TableCell>
                  <TableCell align="right">currencyPairCode</TableCell>
                  <TableCell align="right">ask</TableCell>
                  <TableCell align="right">low</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fxInfo.data.quotes.map((row: FX_INFO) => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {row.high}
                    </TableCell>
                    <TableCell align="right">{row.open}</TableCell>
                    <TableCell align="right">{row.bid}</TableCell>
                    <TableCell align="right">{row.currencyPairCode}</TableCell>
                    <TableCell align="right">{row.ask}</TableCell>
                    <TableCell align="right">{row.low}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </main>

      <footer className={styles.footer}>
        <h3 className={styles.footerSentence}>Created by Tatsu</h3>
      </footer>
    </div>
  );
};

export default Home;
