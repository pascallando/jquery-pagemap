var utils = {
	init_container: function (doc) {
		$('body').find('#container').remove();
		$('body').find('#toc').remove();
		$('body').find('#custom_toc_container').remove();
		$('body').append($('<div id=container>').append(doc));
		$('body').append($('<div id=toc>'));
	}
}

test("Anchor generation", function() {
	var tests = {
		'Oh yeah': '#oh-yeah',
		'Funny !': '#funny',
		'A question ?': '#a-question',
		'  spaces  ': '#spaces',
		'été': '#ete',
		'digits 1 2 3': '#digits-1-2-3',
		'ALLCAPS': '#allcaps',
		'here : that': '#here-that',
		'&é"\'(§è!çà)-$^ù`=:;,<>?./+%£¨*_°#@,.': '#eeca-u'
	}

	$.each(tests, function(string, anchor) {
		var doc = '<h2>'+string+'</h2>';

		utils.init_container(doc);
		$('#container').pagemap({});
		var result = $('#toc').find('a').attr('href')

		ok(result == anchor, result);
	});
});

test("Basic initialization", function() {
	var doc = [
			"<h2>2</h2>",
			"	<h3>3</h3>"
		].join('\n');
	var expected_result = '<ul class="toc0"><li><a href="#2">2</a><ul class="toc2"><li><a href="#3">3</a><ul class="toc3"></ul></li></ul></li></ul>';

	utils.init_container(doc);
	$('#container').pagemap({});
	ok($('#toc').html() == expected_result, "TOC initialized correctly");
});

test('Basic initialization with big doc', function() {
	var doc = [
			"<h2>2</h2>",
				"<h3>3</h3>",
					"<h4>4</h4>",
					"<h4>4</h4>",
				"<h3>3</h3>",
					"<h4>4</h4>",
					"<h4>4</h4>",
			"<h2>2</h2>",
					"<h4>4</h4>",
						"<h5>5</h5>",
			"<h2>2</h2>",
				"<h3>3</h3>",
					"<h4>4</h4>",
					"<h4>4</h4>",
				"<h3>3</h3>",
					"<h4>4</h4>",
					"<h4>4</h4>",
			"<h2>2</h2>",
					"<h4>4</h4>"
		].join('\n');
	var expected_result = '<ul class="toc0"><li><a href="#2">2</a><ul class="toc2"><li><a href="#3">3</a><ul class="toc3"><li><a href="#4">4</a><ul class="toc4"></ul></li><li><a href="#4">4</a><ul class="toc4"></ul></li></ul></li><li><a href="#3">3</a><ul class="toc3"><li><a href="#4">4</a><ul class="toc4"></ul></li><li><a href="#4">4</a><ul class="toc4"></ul></li></ul></li></ul></li><li><a href="#2">2</a><ul class="toc2"><li><a href="#4">4</a><ul class="toc4"><li><a href="#5">5</a><ul class="toc5"></ul></li></ul></li></ul></li><li><a href="#2">2</a><ul class="toc2"><li><a href="#3">3</a><ul class="toc3"><li><a href="#4">4</a><ul class="toc4"></ul></li><li><a href="#4">4</a><ul class="toc4"></ul></li></ul></li><li><a href="#3">3</a><ul class="toc3"><li><a href="#4">4</a><ul class="toc4"></ul></li><li><a href="#4">4</a><ul class="toc4"></ul></li></ul></li></ul></li><li><a href="#2">2</a><ul class="toc2"><li><a href="#4">4</a><ul class="toc4"></ul></li></ul></li></ul>';

	utils.init_container(doc);
	$('#container').pagemap({});
	ok($('#toc').html() == expected_result, "TOC initialized correctly");
});

test("Initialization on custom toc container", function() {
	var doc = [
			"<h2>2</h2>",
			"	<h3>3</h3>"
		].join('\n');
	var expected_result = '<ul class="toc0"><li><a href="#2">2</a><ul class="toc2"><li><a href="#3">3</a><ul class="toc3"></ul></li></ul></li></ul>';

	utils.init_container(doc);
	$('body').append($('<p id=custom_toc_container>'));
	$('#container').pagemap({
		toc_container: '#custom_toc_container'
	});
	ok($('#custom_toc_container').html() == expected_result, "TOC initialized correctly");
});

test("Initialization with custom depths", function() {
	var doc = [
			"<h1>1</h1>",
			"	<h2>2</h2>",
			"		<h3>3</h3>",
			"			<h4>4</h4>"
		].join('\n');
	var expected_result = '<ul class="toc0"><li><a href="#1">1</a><ul class="toc1"><li><a href="#2">2</a><ul class="toc2"><li><a href="#3">3</a><ul class="toc3"></ul></li></ul></li></ul></li></ul>';

	utils.init_container(doc);
	$('#container').pagemap({
		start_depth: 1,
		end_depth: 3
	});
	ok($('#toc').html() == expected_result, "TOC initialized correctly");
});

test("Several tocs initialization on a same page", function() {
	var doc = [
			"<h2>2</h2>",
			"	<h3>3</h3>"
		].join('\n');
	var expected_result = '<ul class="toc0"><li><a href="#2">2</a><ul class="toc2"><li><a href="#3">3</a><ul class="toc3"></ul></li></ul></li></ul>';

	utils.init_container(doc);
	$('#container').pagemap({});

	// Another container...
	$('body').find('#container_2').remove();
	$('body').find('#toc_2').remove();
	$('body').append($('<div id=container_2>').append(doc));
	$('body').append($('<div id=toc_2>'));
	$('#container_2').pagemap({
		toc_container: '#toc_2'
	});

	ok($('#toc').html() == expected_result, "TOC initialized correctly");
	ok($('#toc_2').html() == expected_result, "TOC 2 initialized correctly");
});

test("Performance tests (toc generation for 500 headers content)", function() {
	var nbr_nodes = 500,
		doc = '';

	for (var i = 0; i < nbr_nodes; i++) {
		var depth = Math.floor((Math.random()*5)+1);
		doc += '<h'+depth+'>Something really interesting as a title</h'+depth+'>'
	};

	utils.init_container(doc);
	$('#container').pagemap({});

	ok($('#toc').is(':empty') == false, "TOC initialized (no content validation has been done)");
});