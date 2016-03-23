var csvWriter = require('csv-write-stream'),
		writer = csvWriter( {headers: [ "name", "company", "blog_url",
			"location", "email", "html_url", "public_repos", "public_gists",
			"followers"
		]}),
		fs = require('fs')

module.exports = {
	index: function(req, res) {
		var developers = Developer.find({ email: {'!': ''} })
											 .then(function(model) {
											 	 return res.view('developer/index', {
											 	 	developers: model,
											 	 	count: model.length
											 	 });
											 })
											 .catch(function(error) {
											 	 return negotiate(error);
											 });
		 var sortedDevelopers = _.sortBy(developers, 'followers');
		 return sortedDevelopers;
	},

	import: function(req, res) {
		GithubService.getDevelopers(1, 40);
		res.redirect('developer');
	},

	nuke: function(req, res) {
		Developer.destroy({}).then(function(model){
			return res.redirect('developer')
		}).catch(function(error) {
			return res.negotiate(err);
		})
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

