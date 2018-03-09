new_horizons_data = [ {
	distance_from_sun: 32.76,
	distance_from_earth: 31.76,
	distance_from_pluto: 0.14,
	velociy_relative_to_pluto: 13.77,
	epoch: '2015-06-27 02:00:00 UTC'
} ];

	

/*
	data structure:
		epoch
		distance from Sun (AU)
		distance from Earth (AU)
		distance from Pluto (AU)
		velocity relative to Sun / heliocentric velocity (km/s)
		velocity relative to Pluto (km/s) (ignored)
*/

new_horizons_data = [
	{ '2015-02-04 16:00:00 UTC', 31.58, 32.42, 1.27, 14.61, undefined },
	{ '2015-02-04 16:00:00 UTC', 31.58, 32.42, 1.27, 14.61, undefined },
	{ '2015-03-17 03:00:00 UTC', 31.92, 32.23, 0.95, 14.59, undefined },
	{ '2015-03-22 14:00:00 UTC', 31.96, 32.19, 0.91, 14.58, undefined },
	{ '2015-04-18 00:00:00 UTC', 32.18, 31.96, 0.70, 14.57, undefined },
	{ '2015-05-01 00:00:00 UTC', 32.29, 31.86, 0.59, 14.59, 13.78 },
/*	{ '2015-05-16 14:00:00 UTC', 32.42, 31.76, 0.47, 14.56, 13.80 }, */
	{ '2015-05-20 00:00:00 UTC', 32.45, 31.75, 0.44, 14.56, 13.78 },
	{ '2015-06-20 00:00:00 UTC', 32.71, 31.73, 0.19, 14.54, 13.77 },
	{ '2015-06-27 02:00:00 UTC', 32.76, 31.76, 0.14, 14.54, 13.77 }
];
l