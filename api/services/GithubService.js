var unirest = require('unirest'),
		GithubAPI = 'https://api.github.com',
		OAUTH_TOKEN = 'be6f7b4f9d19f5748fff452e31faf3655e183a6d'

module.exports = {
	getToken: function() {
		var url = GithubAPI + ''
	},

	getDevelopers: function(currentPage, lastPage, location, callback) {
		// replace spaces with a comma
		var loc = (location) ? location.replace(" ", "%2C") + ",Australia" : "Australia";
		var GithubService = this,
				currentPage = currentPage || 1,
		    requestUrl = `${GithubAPI}/search/users?q=location%3A${loc}&page=${currentPage}`;
				console.log(requestUrl);

		unirest.get(requestUrl)
					 .type('json')
					 .header('User-Agent', 'dgroch')
					 .header('Authorization', `Token ${OAUTH_TOKEN}`)
					 .end(function(response){
				 			var developers = response.body.items,
						 			developerCount = response.body.total_count,
					 				pageCount = Math.ceil(developerCount / 30)

			 				console.log(`developer count = ${developerCount}`);

			 				if (currentPage <= lastPage && currentPage <= pageCount) {
			 					_.each(developers, function(developer) {
						 			var id = developer.login;
						 			GithubService.getInfo(id);
						 		});
						 		GithubService.getDevelopers(currentPage + 1, lastPage, location, callback);
			 				}
							else {
								// finish and send the location
								callback(null, location);
							}
					 });
	},

	getInfo: function(id) {
		var requestUrl = `https://api.github.com/users/${id}`

		unirest.get(requestUrl)
					 .type('json')
					 .header('User-Agent', 'dgroch')
					 .header('Authorization', `Token ${OAUTH_TOKEN}`)
					 .end(function(results) {
						 	var newDeveloper = {
						 		username: 					results.body.login || '',
						 	 	github_id: 					parseInt(results.body.id) || '',
						 	 	name: 							results.body.name || '',
						 	 	avatar_url: 				results.body.avatar_url || '',
						 	 	company: 						results.body.company || '',
						 	 	blog_url: 					results.body.blog || '',
						 	 	location: 					results.body.location || '',
						 	 	email: 							results.body.email || '',
						 	 	url: 								results.body.url || '',
						 	 	html_url: 					results.body.html_url || '',
						 	 	public_repos: 			parseInt(results.body.public_repos) || 0,
						 	 	public_gists: 			parseInt(results.body.public_gists) || 0,
						 	 	followers: 					parseInt(results.body.followers) || 0,
						 	 	following: 					parseInt(results.body.following) || 0,
						 	 	followers_url: 			results.body.followers_url || '',
						 	 	following_url: 			results.body.following_url || '',
						 	 	gists_url: 					results.body.gists_url || '',
						 	 	subscriptions_url: 	results.body.subscriptions_url || '',
						 	 	organisations_url: 	results.body.organisations_url || '',
						 	 	repos_url: 					results.body.repos_url || ''
						 	}

					 	 Developer.create(newDeveloper).exec(function(err, model) {
						 		if (err) {
									console.log(err)
								} else {
									console.log(`added ${model.username}`)
								}
							});
					 });
	}
}
