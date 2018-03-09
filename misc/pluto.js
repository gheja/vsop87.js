/*
  this script is heavily based on Stellarium source code
  
  for more information see: https://code.launchpad.net/~stellarium/stellarium/
*/

/*
Copyright (C) 2001 Liam Girdwood <liam@nova-ioe.org>
Copyright (C) 2003 Fabien Ch?reau

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU Libary General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
*/

var argument = [
	[0, 0, 1],
	[0, 0, 2],
	[0, 0, 3],
	[0, 0, 4],
	[0, 0, 5],
	[0, 0, 6],
	[0, 1, -1],
	[0, 1, 0],
	[0, 1, 1],
	[0, 1, 2],
	[0, 1, 3],
	[0, 2, -2],
	[0, 2, -1],
	[0, 2, 0],
	[1, -1, 0],
	[1, -1, 1],
	[1, 0, -3],
	[1, 0, -2],
	[1, 0, -1],
	[1, 0, 0],
	[1, 0, 1],
	[1, 0, 2],
	[1, 0, 3],
	[1, 0, 4],
	[1, 1, -3],
	[1, 1, -2],
	[1, 1, -1],
	[1, 1, 0],
	[1, 1, 1],
	[1, 1, 3],
	[2, 0, -6],
	[2, 0, -5],
	[2, 0, -4],
	[2, 0, -3],
	[2, 0, -2],
	[2, 0, -1],
	[2, 0, 0],
	[2, 0, 1],
	[2, 0, 2],
	[2, 0, 3],
	[3, 0, -2],
	[3, 0, -1],
	[3, 0, 0]
];

var longitude = [
	[-19799805, 19850055],
	[897144, -4954829],
	[611149, 1211027],
	[-341243, -189585],
	[129287, -34992],
	[-38164, 30893],
	[20442, -9987],
	[-4063, -5071],
	[-6016, -3336],
	[-3956, 3039],
	[-667, 3572],
	[1276, 501],
	[1152, -917],
	[630, -1277],
	[2571, -459],
	[899, -1449],
	[-1016, 1043],
	[-2343, -1012],
	[7042, 788],
	[1199, -338],
	[418, -67],
	[120, -274],
	[-60, -159],
	[-82, -29],
	[-36, -20],
	[-40, 7],
	[-14, 22],
	[4, 13],
	[5,2],
	[-1,0],
	[2,0],
	[-4, 5],
	[4, -7],
	[14, 24],
	[-49, -34],
	[163, -48],
	[9, 24],
	[-4, 1],
	[-3,1],
	[1,3],
	[-3, -1],
	[5, -3],
	[0,0]
];

var latitude = [
	[-5452852, -14974862],
	[3527812, 1672790],
	[-1050748, 327647],
	[178690, -292153],
	[18650, 100340],
	[-30697, -25823],
	[4878, 11248],
	[226, -64],
	[2030, -836],
	[69, -604],
	[-247, -567],
	[-57, 1],
	[-122, 175],
	[-49, -164],
	[-197, 199],
	[-25, 217],
	[589, -248],
	[-269, 711],
	[185, 193],
	[315, 807],
	[-130, -43],
	[5, 3],
	[2, 17],
	[2, 5],
	[2, 3],
	[3, 1],
	[2, -1],
	[1, -1],
	[0, -1],
	[0, 0],
	[0, -2],
	[2, 2],
	[-7, 0],
	[10, -8],
	[-3, 20],
	[6, 5],
	[14, 17],
	[-2, 0],
	[0, 0],
	[0, 0],
	[0, 1],
	[0, 0],
	[1, 0]
];    

var radius = [
	[66865439, 68951812],
	[-11827535, -332538],
	[1593179, -1438890],
	[-18444, 483220],
	[-65977, -85431],
	[31174, -6032],
	[-5794, 22161],
	[4601, 4032],
	[-1729, 234],
	[-415, 702],
	[239, 723],
	[67, -67],
	[1034, -451],
	[-129, 504],
	[480, -231],
	[2, -441],
	[-3359, 265],
	[7856, -7832],
	[36, 45763],
	[8663, 8547],
	[-809, -769],
	[263, -144],
	[-126, 32],
	[-35, -16],
	[-19, -4],
	[-15, 8],
	[-4, 12],
	[5, 6],
	[3, 1],
	[6, -2],
	[2, 2],
	[-2, -2],
	[14, 13],
	[-63, 13],
	[136, -236],
	[273, 1065],
	[251, 149],
	[-25, -9],
	[9, -2],
	[-8, 7],
	[2, -10],
	[19, 35],
	[10, 2]
];

function sphe_to_rect(lng, lat, r)
{
	return {
		x: Math.cos(lng) * Math.cos(lat) * r,
		y: Math.sin(lng) * Math.cos(lat) * r,
		z: Math.sin(lat) * r
	};
}

/*
 Chap 37. Equ 37.1
 params : Julian day, Longitude, Latitude, Radius

 Calculate Pluto heliocentric ecliptical coordinates for given julian day.
 This function is accurate to within 0.07" in longitude, 0.02" in latitude
 and 0.000006 AU in radius.
 Note: This function is not valid outside the period of 1885-2099.
 Longitude and Latitude are in radians, radius in AU.
*/
function get_pluto_helio_coords(datetime)
{
	var sum_longitude, sum_latitude, sum_radius, J, S, P, t, a, sin_a, cos_a, i, L, B, R;
	
	/* get julian centuries since J2000 */
	// t = (julian_day - 2451545) / 36525;
	t = vsop87_get_millenias(datetime);
	
	/* calculate mean longitudes for jupiter, saturn and pluto */
	J =  34.35 + 3034.9057 * t;
	S =  50.08 + 1222.1138 * t;
	P = 238.96 +  144.9600 * t;
	
	/* calc periodic terms in table 37.A */
	sum_longitude = 0;
	sum_latitude = 0;
	sum_radius = 0;
	
	for (i=0; i < longitude.length; i++)
	{
		a = argument[i][0] * J + argument[i][1] * S + argument[i][2] * P;
		sin_a = Math.sin(Math.PI/180.*a);
		cos_a = Math.cos(Math.PI/180.*a);
		
		/* longitude */
		sum_longitude += longitude[i][0] * sin_a + longitude[i][1] * cos_a;
		
		/* latitude */
		sum_latitude += latitude[i][0] * sin_a + latitude[i][1] * cos_a;
		
		/* radius */
		sum_radius += radius[i][0] * sin_a + radius[i][1] * cos_a;
	}
	
	/* calc L, B, R */
	L = Math.PI/180. * (238.958116 + 144.96 * t + sum_longitude * 0.000001);
	B = Math.PI/180. * (-3.908239 + sum_latitude * 0.000001);
	R = (40.7241346 + sum_radius * 0.0000001);
	
	/* convert to rectangular coord */
	return sphe_to_rect(L, B, R);
}
