/**
  * This is a library to use the VSOP87 theorem to calculate positions of
  * planets in the Solar System relative to the Sun.
  *
  * The library depends on the VSOP87 C series (Heliocentric ecliptic
  * rectangular coordinates for the equinox of the day).
  *
  * Sources:
  *   * theorem: https://en.wikipedia.org/wiki/VSOP_(planets)
  *   * datafiles: ftp://cdsarc.u-strasbg.fr/pub/cats/VI%2F81/
  *   * calculations: http://www.caglow.com/info/compute/vsop87
  *
  * See the GitHub page: https://github.com/gheja/vsop87.js
  *
  * This library is optimized for readability and simplicity, not speed
  * or size, as I was unable to find a simple JavaScript example for the
  * handling of VSOP87 series and wanted to share it.
  */

/**
  * Reads a file into a buffer.
  *
  * @param {string} filename The name of file to be read (can be an URL).
  * @return {Array}
  */
function vsop87_get_file(filename)
{
	var xhr, result;
	
	result = null;
	
	xhr = new XMLHttpRequest();
	xhr.open("GET", filename, false);
	xhr.overrideMimeType("text/plain; charset=US-ASCII");
	xhr.onreadystatechange = function()
	{
		if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 0))
		{
			result = xhr.responseText;
		}
	}
	xhr.send(null);
	
	return result;
}

/**
  * Parses the file read by vsop87_get_file().
  * 
  * @params {Array} file Contents of the file.
  */
function vsop87_parse_file(file)
{
	var lines, coeffs, i, j, a, b, c;
	
	lines = file.split('\n');
	
	j = -1;
	
	// the calculation needs these 18 sections
	// the file might store only 17 (z5 omitted), in that case the
	// last one will be filled with zeroes
	coeff_keys = new Array(
		'x0', 'x1', 'x2', 'x3', 'x4', 'x5',
		'y0', 'y1', 'y2', 'y3', 'y4', 'y5',
		'z0', 'z1', 'z2', 'z3', 'z4', 'z5'
	);
	
	// the coeffs will be stored here
	coeffs = {};
	
	for (i=0; i<lines.length; i++)
	{
		// all data lines must be 132 characters long or they will be skipped
		if (lines[i].length != 132)
		{
			continue;
		}
		
		// all sections begin with this string
		if (lines[i].indexOf(' VSOP87 VERSION C3') === 0)
		{
			j++;
			coeffs[coeff_keys[j]] = new Array();
		}
		else
		{
			// each line has 19 values, we need the three last of them only
			// the values are placed in fixed positions, we will use this
			
			a = parseFloat(lines[i].substring(79, 97));
			b = parseFloat(lines[i].substring(97, 111));
			c = parseFloat(lines[i].substring(111, 131));
			
			coeffs[coeff_keys[j]].push(new Array(a, b, c));
		}
	}
	
	// if the last section was omitted in file, fill it with zeroes
	if (j == 16)
	{
		j++;
		coeffs[coeff_keys[j]] = new Array(new Array(0, 0, 0));
	}
	
	if (j != 17)
	{
		alert("Invalid VSOP87C file, less than 17 sections were found.");
		return null;
	}
	
	return coeffs;
}

/**
  * Get the millenias needed for the calculations from a JavaScript Date object.
  *
  * @param {Date} datetime The Date object need to be converted
  * @return {number} millenias passed since J2000.0
  */
function vsop87_get_millenias(datetime)
{
	var time, j2000_0;
	// UTC: Coordinated Universal Time
	// TAI: International Atomic Time
	// TT: Terrestrial Time
	//
	// TAI is exactly UTC +19 seconds
	// TT is about TAI +32.184 seconds
	//
	// the calculations need the Julian millenias, in TT
	
	// get the milliseconds since the UTC Epoch, in UTC time zone
	time = datetime.getTime();
	
	// correct it to the J2000.0 Epoch (2000-01-01 11:58:55.816 UTC
	// = 946727935816 milliseconds since Unix Epoch)
	j2000_0 = new Date(946727935816);
	time = time - j2000_0.getTime();
	
	// convert it to TT
	time = time + 19000 + 32184;
	
	// convert it to days
	time = time / 1000 / 60 / 60 / 24;
	
	// convert it to millenias
	time = time / 365.25 / 1000;
	
	return time;
}

/**
  * Helper function to calculate the sums of the coefficient series.
  *
  * @param {Array} coeffs The array of coefficient arrays
  * @param {string} key The key of the coefficient array that need to be processed
  * @param {number} time Millenias passed since J2000.0
  * @param {number} power Coefficient index
  * @return {number} Sum of the coefficients
  */
function vsop87_get_coeff_sum(coeffs, key, time, power)
{
	var i, result;
	
	result = 0;
	
	for (i=0; i<coeffs[key].length; i++)
	{
		result = result + coeffs[key][i][0] * Math.cos(coeffs[key][i][1] + coeffs[key][i][2] * time);
	}
	
	result = result * Math.pow(time, power);
	
	return result;
}

/**
  * Get the Heliocentric position of the Planet defined by the coefficients at
  * a given time.
  *
  * The returned coordinates are relative to the Sun (it is 0, 0, 0), expressed
  * in AU (Astronomical Units, 149 597 871 kilometers).
  *
  * @param {Array} coeffs The array of coefficient arrays
  * @param {Date} datetime The JavaScript Date object
  * @result {Array} Array of the coordinates
  */
function vsop87_get_position(coeffs, datetime)
{
	var time, x, y, z;
	
	time = vsop87_get_millenias(datetime);
	
	x = vsop87_get_coeff_sum(coeffs, 'x0', time, 0) +
		vsop87_get_coeff_sum(coeffs, 'x1', time, 1) +
		vsop87_get_coeff_sum(coeffs, 'x2', time, 2) +
		vsop87_get_coeff_sum(coeffs, 'x3', time, 3) +
		vsop87_get_coeff_sum(coeffs, 'x4', time, 4) +
		vsop87_get_coeff_sum(coeffs, 'x5', time, 5);
	
	y = vsop87_get_coeff_sum(coeffs, 'y0', time, 0) +
		vsop87_get_coeff_sum(coeffs, 'y1', time, 1) +
		vsop87_get_coeff_sum(coeffs, 'y2', time, 2) +
		vsop87_get_coeff_sum(coeffs, 'y3', time, 3) +
		vsop87_get_coeff_sum(coeffs, 'y4', time, 4) +
		vsop87_get_coeff_sum(coeffs, 'y5', time, 5);
	
	z = vsop87_get_coeff_sum(coeffs, 'z0', time, 0) +
		vsop87_get_coeff_sum(coeffs, 'z1', time, 1) +
		vsop87_get_coeff_sum(coeffs, 'z2', time, 2) +
		vsop87_get_coeff_sum(coeffs, 'z3', time, 3) +
		vsop87_get_coeff_sum(coeffs, 'z4', time, 4) +
		vsop87_get_coeff_sum(coeffs, 'z5', time, 5);
	
	position = { x: x, y: y, z: z };
	
	return position;
}
