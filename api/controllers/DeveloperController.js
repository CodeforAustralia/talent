var csvWriter = require('csv-write-stream'),
		/*writer = csvWriter( {headers: [ "name", "company", "blog_url",
			"location", "email", "html_url", "public_repos", "public_gists",
			"followers"
		]}),*/
		fs = require('fs');

module.exports = {
	index: function(req, res) {
		var filters = {email: {'!': ''}};
		var location = req.query.location;
    var sort_query = '';
		if (req.query.location) filters.location = {'contains': location};
    if (req.query.sort_field){
      var sort_order = req.query.sort_order.toUpperCase() || "DESC";
      sort_query = req.query.sort_field + " " + sort_order;
    }

		var developers = Developer.find(filters, {sort: sort_query})
											 .then(function(model) {
												 var response = {
											 	 	developers: model,
											 	 	count: model.length
												 };
												 if (req.query.location) response.location = location;
											 	 return res.view('developer/index', response);
											 })
											 .catch(function(error) {
											 	 return negotiate(error);
											 });
	},

	import: function(req, res) {
		var loc = (req.query.location) ? req.query.location : null;
		GithubService.getDevelopers(1, 40, loc, function(err, location){
			console.log("Done!");
			//console.log("Writing file " + filename);
			//res.redirect('developer/exportToCSV?file='+filename+'&location='+location);
			res.redirect('developer?location='+location);
		});
	},

	nuke: function(req, res) {
		Developer.destroy({}).then(function(model){
			return res.redirect('developer');
		}).catch(function(error) {
			return res.negotiate(err);
		});
	},

	exportToCSV: function(req, res) {
		var file = 'developers.csv';
		var filters = {};
		var location = null;
		if (req.query.location){
			location = req.query.location.replace(",", " ");
			file = 'developers-'+location.replace(" ", "-")+'.csv';
			filters.location = {'contains':location};
		}

		var writer = csvWriter({headers: [
			 "name", "company", "blog_url",
			"location", "email", "html_url", "public_repos", "public_gists",
			"followers"
		]});

		writer.pipe(fs.createWriteStream(file));

		writer.on('error', function(err) {
				 console.log("ERROR:" + err);
				 writer.end();
		 });

		writer.on('end', function(){
			console.log("FINISHED");
		});

		Developer.find(filters).then(function(developers) {

			_.each(developers, function(dev) {
				if (dev.email) {
					writer.write([
						dev.name,
						dev.company,
						dev.blog_url,
						dev.location,
						dev.email,
						dev.html_url,
						dev.public_repos,
						dev.public_gists,
						dev.followers
					]);
				}
			});

		}).then(function(){
			writer.end();
			writer = null;
			res.redirect('developer');
		});
		/*}).then(function() {
			writer.end();
			res.redirect('developer');
		}).catch(function(error) {
			console.log(error);
		});*/
	}
};
