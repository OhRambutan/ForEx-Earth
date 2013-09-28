<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN">

<html lang="en">
<head>
	<!-- Bootstrap -->
	<script src="js/jquery/jquery-1.10.2.js" type="text/javascript"></script>
	<script src="js/bootstrap/bootstrap.min.js" type="text/javascript"></script>	

	<link rel="stylesheet" href="css/bootstrap.min.css" type="text/css">
	<link rel="stylesheet" href="css/bootstrap-responsive.css" type="text/css">
	
	<script src="js/forex_earth.js" type="text/javascript"></script>	
		
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
    
	<title>ForEx Earth</title>
</head>
<body>
	<div class="container-fluid span12 text-center">
    	
		<textarea id="result" wrap="off" class="span5"></textarea>
	    
	
		<div class="btn-toolbar row-fluid">	
			<div class="btn-group">
				<button id="getInstruments" type="button" class="btn btn-info">Exchange Options</button>
				<button id="getQuote" type="button" class="btn btn-info">Exchange Rate</button>
				<button id="getHistory" type="button" class="btn btn-info">Exchange Rate History</button>
			</div>
		</div>
	</div>
</body>
</html>

