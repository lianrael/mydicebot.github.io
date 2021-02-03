/**
 *     Sample script, you can code here and then 'Save As..' to another named file.
 *     Author: MyDiceBot
 **/

const e = require("express");

chance = 49.5;
multiplier = 2;
// baseBet = 0.00000100;
baseBet = 0.00000001;
betHigh = false;
nextBet = baseBet;

MAX_BETS = 10000;
MAX_BETS_BASE = MAX_BETS;
BET_CHANCE_MIN = 48;
BET_CHANCE_MAX = 49;
STOP_ON_PROFIT = 0.00012;
STOP_ON_PROFIT_BASE = STOP_ON_PROFIT;
MAX_STRAKE_BEFORE_REFRESH = -13;
MAX_STRAKE_BEFORE_STRAKE_STOP = 5;

CHECK_AFTER_EVERY = 50;
MIN_BET_AMOUNT = 1; // x/100000000
MAX_BET_AMOUNT = 6; // x/100000000
CHANGE_CHANGE_ON_EVERY_BET_COUNT_MIN = 100;
CHANGE_CHANGE_ON_EVERY_BET_COUNT_MAX = 300;
CHANGE_BET_ON_EVERY_BET_COUNT_MIN = 5;
CHANGE_BET_ON_EVERY_BET_COUNT_MAX = 20;
PAUSE_TO_CONTINUE_MIN = 10;
PAUSE_TO_CONTINUE_MAX = 20;

shouldCheck = false;
winCountChange = 0;
streakWrongChecks = 0
isRefreshSeed = false;
maxStreakLimitCount = 0;
changeChanceBetCount = 50;
maxStreakWinChangeBet = 5;
maxStreakWinChangeBetCount = 0;
tooHighStreakes = false;
numberOfGoalsAchieved = 0;

function betsPercent(percent, bets) {
    return ((percent / 100) * bets);
}

function dobet() {
    if (profit >= STOP_ON_PROFIT) {
        numberOfGoalsAchieved++;
        console.error("GOAL OF " + profit + " ACHIEVE! # " + numberOfGoalsAchieved)
        process.stderr.write("\007");
        if (numberOfGoalsAchieved >= 6) {
            var pauseFor = randomwitoutdecimal(65, 70) * 60000;
            console.error("Finish! will continue in " + pauseFor);
            pause(pauseFor);
        } else {
            var startIn = randomwitoutdecimal(PAUSE_TO_CONTINUE_MIN, PAUSE_TO_CONTINUE_MAX) * 60000
            console.error("resuming in " + startIn / 60000 + " minutes");
            STOP_ON_PROFIT = STOP_ON_PROFIT + STOP_ON_PROFIT_BASE;
            MAX_BETS = bets + MAX_BETS_BASE
            console.error("Looking for profit of " + STOP_ON_PROFIT);
            pause(startIn);
        }
    }

    if (currentstreak <= MAX_STRAKE_BEFORE_REFRESH) {
        isRefreshSeed = true;
    }

    if (currentstreak >= MAX_STRAKE_BEFORE_REFRESH * -1) {
        isRefreshSeed = true;
    }

    if (currentstreak >= 17 || currentstreak <= -17) {
        tooHighStreakes = true;
    }

    if (bets % CHECK_AFTER_EVERY === 0) {
        shouldCheck = true;
    }

    if (win) {
        nextBet = basebet;
        winCountChange++;
        maxStreakWinChangeBetCount++;

        if (shouldCheck) {
            shouldCheck = false;
            var diff = abs(wins - losses);

            if (diff > betsPercent(13, bets)) {
                betHigh = !betHigh;
                streakWrongChecks++;
                console.log('difference is high ', diff, bets, wins, losses)
                console.error('difference is high ', diff, bets, wins, losses)
                pause(randomwitoutdecimal(5, 20) * 1000);
            } else {
                streakWrongChecks = 0;
            }

            if (streakWrongChecks >= 2) {
                process.stderr.write("\007");
                console.error('****** MAX HIGH DIFFERENCE *****')
                console.error("New Seed!!")
                resetseed();
                stop();
            }

        }

        if (isRefreshSeed) {
            if (maxStreakLimitCount % 3 === 0) {
                console.error("New Seed!")
                resetseed();
            }
            betHigh = !betHigh;
            isRefreshSeed = false;
            maxStreakLimitCount++;
            console.error("Inverting lowHight")
        }

        if (maxStreakWinChangeBetCount >= maxStreakWinChangeBet) {
            maxStreakWinChangeBetCount = 0;
            maxStreakWinChangeBet = randomwitoutdecimal(
                CHANGE_BET_ON_EVERY_BET_COUNT_MIN,
                CHANGE_BET_ON_EVERY_BET_COUNT_MAX
            );
            basebet = randomwitoutdecimal(
                MIN_BET_AMOUNT,
                MAX_BET_AMOUNT,
            ) / 100000000;
            console.log("New Base!")
        }

        if (winCountChange >= changeChanceBetCount) {
            winCountChange = 0;
            chance = random(BET_CHANCE_MIN, BET_CHANCE_MAX);
            changeChanceBetCount = randomwitoutdecimal(
                CHANGE_CHANGE_ON_EVERY_BET_COUNT_MIN,
                CHANGE_CHANGE_ON_EVERY_BET_COUNT_MAX
            );
        }

        if (tooHighStreakes) {
            process.stderr.write("\007");
            console.error("******** too high streaks .... ******");
            stop();
        }

        if (maxStreakLimitCount >= MAX_STRAKE_BEFORE_STRAKE_STOP) {
            process.stderr.write("\007");
            console.error("******** max streaks .... ******");
            stop();
        }

        if (bets >= MAX_BETS) {
            console.error("******** MAX BETS reached.... ******");
            process.stderr.write("\007");
            stop();
        }

    } else {
        nextBet = previousbet * multiplier;
    }
}

