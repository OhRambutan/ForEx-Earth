/**
 * Get a dictionary of all instruments. 
 */
function getInstruments(){
        
    OANDA.rate.instruments(['instrument', 'displayName'], function(response) {
        if(response && !response.error) {
            var instruments = {};
            
            // create a dictionary of instruments
            $.each(response.instruments, function(index) {
                instruments[response.instruments[index].instrument] = response.instruments[index].displayName;
            });

            // Do something with instruments
            displayResult(response, 'instruments');
        }
    });    
}


/**
 * Get current data for provided pair (VAL1_VAL2).
 */
function getQuote(pair) {
    
    OANDA.rate.quote([pair], function(response) {
        if(response && !response.error) {
            // initialize sell and buy prices
            var bid = response.prices[0].bid;
            var ask = response.prices[0].ask;
            
            // Do something with prices
            displayResult(response, 'quote');
        }
    });    
}

/**
 * Get history for provided pair (VAL1_VAL2). Time slice, measured by granularity, is 1 day. 
 * If start and end are not provided, default chunk of history (10 day) is returned. 
 * Start and end parameters are used to obtain a particular time slice history and 
 * must be in RFC3339 time format. 
 */
function getHistory(pair, start, end) {
    if (typeof start === 'undefined') {
        var postParams = {granularity: 'D', count: 10 };
    }
    else {
        var postParams = {granularity: 'D', start: start, end: end, includeFirst: false };
    }
    
    OANDA.rate.history(pair, postParams, function(response) {
        if(response && !response.error) {
            // create an array of candlesticks
            var candlesticks = {};            
            $.each(response.candles, function(index) {
                candlesticks[index] = response.candles[index];
            });
        
            // Do something with response
            displayResult(response, 'history');
        }
    });
    
}

/**
 * Display formatted data in a result textarea. 
 */
function displayResult(data, dataType) {
    var instrumentDescription = '';
    
    switch(dataType) {
        
        case "instruments":
            instrumentDescription = displayInstruments(data);
            break;
        
        case "quote": 
            instrumentDescription = displayQuote(data);
            break;
            
        case "history":
            instrumentDescription = displayHistory(data);
            break;
        
        default:
            instrumentDescription = "option not supported";  
    }
    
    $("#result").val(instrumentDescription);
    
}

/**
 * Return a string instrumentDescription where each line is in form "instrument : displayedName" 
 */
function displayInstruments(data) {
    var instrumentDescription = '';
    $.each(data.instruments, function(index) {
        instrumentDescription = instrumentDescription + 
                                data.instruments[index].instrument + ": "+ 
                                data.instruments[index].displayName + "\n";
    });
    return instrumentDescription;
    
}

/**
 * Return a string with instrument name, it's sell price and buy price.  
 */
function displayQuote(data) {
    return data.prices[0].instrument +  
            "\nsell price: " +  data.prices[0].bid + 
            "\nbuy price: " + data.prices[0].ask;
}


/**
 * Return a string instrumentDescription that contains opening, closing, highest, and lowest 
 * values for buy and sell price of an instrument at each slice of time (default: day).
 */
function displayHistory(data) {
    var instrumentDescription = data.instrument + "\n";
    $.each(data.candles, function(index) {
        instrumentDescription = instrumentDescription + "\n" + 
                                "time: " + data.candles[index].time + "\n" + 
                                "openinig sell price: " + data.candles[index].openBid + "\n" + 
                                "opening buy price: " + data.candles[index].openAsk + " \n" + 
                                "highest sell price: " + data.candles[index].highBid + " \n" + 
                                "highest buy price: " + data.candles[index].highAsk + " \n" + 
                                "lowest sell price: " + data.candles[index].lowBid + " \n" + 
                                "lowest buy price: " + data.candles[index].lowAsk + " \n" + 
                                "closing sell price: " + data.candles[index].closeBid + " \n" + 
                                "closing buy price: " + data.candles[index].closeBid + " \n"                                 
    });
    return instrumentDescription;
    
}


$(document).ready(function(){
    // TODO: after figuring out implementation, actually provide pair.
    var pair = 'AUD_CAD';
    var start = '2013-06-21T00:00:00Z';
    var end = '2013-06-21T23:59:59Z';
    
    $("#getInstruments").click(function() { getInstruments(); });
    $("#getQuote").click(function() { getQuote(pair); });
    $("#getHistory").click(function() { getHistory(pair); });
    // $("#getHistory").click(function() { getHistory(pair, start, end); });
});