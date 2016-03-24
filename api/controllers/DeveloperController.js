var csvWriter = require('csv-write-stream'),
		writer = csvWriter( {headers: [ "name", "company", "blog_url",
			"location", "email", "html_url", "public_repos", "public_gists",
			"followers"
		]}),
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
		GithubService.getDevelopers(1, 40);
		res.redirect('developer');
	},

	nuke: function(req, res) {
		Developer.destroy({}).then(function(model){
			return res.redirect('developer');
		}).catch(function(error) {
			return res.negotiate(err);
		});
	},

	exportToCSV: function(req, res) {
		Developer.find().then(function(developers) {
			writer.pipe(fs.createWriteStream('developers.csv'));
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
		}).then(function() {
			writer.end();
			res.redirect('developer')
		}).catch(function(error) {
			console.log(error);
		});
	}
};
