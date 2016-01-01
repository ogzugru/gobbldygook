import {expect} from 'chai'
import convertStudent from '../../src/helpers/convert-imported-student'

const sample = Object.freeze({
	courses: [
		{
			'term': 20119,
			'clbid': 87891,
			'deptnum': 'CSCI 1043P',
			'lab': false,
			'name': 'Intro Pgrm Prob Slvg',
			'credits': 0,
			'gradetype': 'No Grade',
			'gereqs': [],
			'times': [],
			'locations': [],
			'instructors': [],
		},
		{
			'term': 20119,
			'clbid': 81526,
			'deptnum': 'REG 0001',
			'lab': false,
			'name': 'St. Olaf Equiv Credits',
			'credits': 1,
			'gradetype': 'No Grade',
			'gereqs': [],
			'times': [],
			'locations': [],
			'instructors': [],
		},
		{
			'term': 20121,
			'clbid': 82908,
			'deptnum': 'AMCON 101A',
			'lab': false,
			'name': 'Declaring Ind: 1607-1865',
			'credits': 1,
			'gradetype': 'Graded',
			'gereqs': [],
			'times': ['MWF 1255-0150PM'],
			'locations': ['BMC 101'],
			'instructors': ['Hahn, Steven C.', 'Wells, Colin'],
		},
		{
			'term': 20121,
			'clbid': 83505,
			'deptnum': 'CSCI 121',
			'lab': false,
			'name': 'Principles Comp Sci',
			'credits': 1,
			'gradetype': 'Graded',
			'gereqs': ['AQR'],
			'times': ['MWF 1150-1245PM'],
			'locations': ['RNS 203'],
			'instructors': ['Allen, Richard'],
		},
		{
			'term': 20121,
			'clbid': 82768,
			'deptnum': 'JAPAN 111A',
			'lab': false,
			'name': 'Beginning Japanese I',
			'credits': 1,
			'gradetype': 'Graded',
			'gereqs': [],
			'times': ['MWF 1045-1140'],
			'locations': ['TOH 112'],
			'instructors': ['Bridges IV, William H.'],
		},
		{
			'term': 20121,
			'clbid': 82771,
			'deptnum': 'JAPAN 111B',
			'lab': true,
			'name': 'Beginning Japanese I Lab',
			'credits': 0,
			'gradetype': 'No Grade',
			'gereqs': [],
			'times': ['Th 0930-1025'],
			'locations': ['TOH 175'],
			'instructors': ['Bridges IV, William H.'],
		},
		{
			'term': 20121,
			'clbid': 82792,
			'deptnum': 'REL 121C',
			'lab': false,
			'name': 'Bible/Culture/Commun',
			'credits': 1,
			'gradetype': 'Graded',
			'gereqs': ['BTS-B'],
			'times': ['MWF 0905-1000'],
			'locations': ['OM 240'],
			'instructors': ['Odell, Margaret'],
		},
		{
			'term': 20122,
			'clbid': 85898,
			'deptnum': 'ASIAN 130',
			'lab': false,
			'name': 'Japan SciFi/Global Persp',
			'credits': 1,
			'gradetype': 'Graded',
			'gereqs': ['ALS-L', 'MCG'],
			'times': ['M-F 1040-1240PM'],
			'locations': ['TOH 112'],
			'instructors': ['Bridges IV, William H.'],
		},
		{
			'term': 20123,
			'clbid': 84513,
			'deptnum': 'AMCON 102B',
			'lab': false,
			'name': 'Dem Vistas: 1800-1900',
			'credits': 1,
			'gradetype': 'Graded',
			'gereqs': ['FYW', 'HWC'],
			'times': ['MWF 1255-0150PM'],
			'locations': ['TOH 210'],
			'instructors': ['McClure, Robert W.', 'Wells, Colin'],
		},
		{
			'term': 20123,
			'clbid': 84461,
			'deptnum': 'ASIAN 268',
			'lab': false,
			'name': 'Chinese Calligraphy',
			'credits': 1,
			'gradetype': 'Graded',
			'gereqs': ['ALS-A', 'MCG'],
			'times': ['T 1145-0110PM', 'Th 1245-0205PM'],
			'locations': ['HH 307', 'HH 307'],
			'instructors': ['Wan, Pin Pin'],
		},
		{
			'term': 20123,
			'clbid': 85991,
			'deptnum': 'CSCI 251',
			'lab': false,
			'name': 'Software Design',
			'credits': 1,
			'gradetype': 'Graded',
			'gereqs': [],
			'times': ['MWF 0905-1000'],
			'locations': ['RNS 203'],
			'instructors': ['Advisor, Name O.'],
		},
		{
			'term': 20123,
			'clbid': 85992,
			'deptnum': 'CSCI 252A',
			'lab': true,
			'name': 'Software Design/Lab',
			'credits': 0.25,
			'gradetype': 'Graded',
			'gereqs': [],
			'times': ['W 0300-0500PM'],
			'locations': ['RNS 203'],
			'instructors': ['Advisor, Name O.'],
		},
		{
			'term': 20123,
			'clbid': 84378,
			'deptnum': 'JAPAN 112A',
			'lab': false,
			'name': 'Beginning Japanese II',
			'credits': 1,
			'gradetype': 'Graded',
			'gereqs': [],
			'times': ['MWF 1045-1140'],
			'locations': ['TOH 112'],
			'instructors': ['Ito, Rika'],
		},
		{
			'term': 20123,
			'clbid': 84381,
			'deptnum': 'JAPAN 112B',
			'lab': true,
			'name': 'Beginning Japanese II Lab',
			'credits': 0,
			'gradetype': 'No Grade',
			'gereqs': [],
			'times': ['Th 0930-1025'],
			'locations': ['TOH 175'],
			'instructors': ['Ito, Rika'],
		},
		{
			'term': 20131,
			'clbid': 89090,
			'deptnum': 'AMCON 201A',
			'lab': false,
			'name': 'Remaking Am: 1865-1945',
			'credits': 1,
			'gradetype': 'Graded',
			'gereqs': ['ALS-L', 'MCD',
			'WRI'],
			'times': ['MWF 1150-1245PM'],
			'locations': ['HH 317'],
			'instructors': ['Wells, Colin'],
		},
		{
			'term': 20131,
			'clbid': 88273,
			'deptnum': 'ASIAN 210',
			'lab': false,
			'name': 'AsianCon1:MappingJourneys',
			'credits': 1,
			'gradetype': 'Graded',
			'gereqs': [],
			'times': ['T 1145-0110PM', 'Th 1245-0205PM'],
			'locations': ['RNS 150', 'RNS 150'],
			'instructors': ['Ito, Rika', 'Kucera, Karil J.'],
		},
		{
			'term': 20131,
			'clbid': 88630,
			'deptnum': 'ASIAN 275',
			'lab': false,
			'name': 'ID Approaches to Asia',
			'credits': 0.25,
			'gradetype': 'Graded',
			'gereqs': [],
			'times': ['M 0700-0900PM'],
			'locations': ['RML 477'],
			'instructors': ['MacPherson, Kristina'],
		},
		{
			'term': 20131,
			'clbid': 88593,
			'deptnum': 'CSCI 241',
			'lab': false,
			'name': 'Hardware Design',
			'credits': 1,
			'gradetype': 'Graded',
			'gereqs': [],
			'times': ['MWF 1255-0150PM'],
			'locations': ['RNS 203'],
			'instructors': ['Brown, Richard'],
		},
		{
			'term': 20131,
			'clbid': 88681,
			'deptnum': 'JAPAN 231',
			'lab': false,
			'name': 'Intermed Japanese I',
			'credits': 1,
			'gradetype': 'Graded',
			'gereqs': ['FOL-J'],
			'times': ['MWF 0200-0255PM'],
			'locations': ['TOH 314'],
			'instructors': ['Akimoto, Hiroe'],
		},
		{
			'term': 20131,
			'clbid': 88682,
			'deptnum': 'JAPAN 231',
			'lab': true,
			'name': 'Intermed Japanese I Lab',
			'credits': 0,
			'gradetype': 'No Grade',
			'gereqs': [],
			'times': ['T 0935-1030'],
			'locations': ['TOH 153'],
			'instructors': ['Akimoto, Hiroe'],
		},
		{
			'term': 20132,
			'clbid': 89466,
			'deptnum': 'ASIAN 215',
			'lab': false,
			'name': 'AsianCon2: Encounter Asia',
			'credits': 1,
			'gradetype': 'Graded',
			'gereqs': [],
			'times': [],
			'locations': [],
			'instructors': ['Entenmann, Robert', 'Bridges IV, William H.'],
		},
		{
			'term': 20133,
			'clbid': 90719,
			'deptnum': 'AMCON 202A',
			'lab': false,
			'name': 'Pur/Happiness: 1920-Pres.',
			'credits': 1,
			'gradetype': 'Graded',
			'gereqs': ['ALS-A', 'HBS',
			'ORC',
			'WRI'],
			'times': ['MWF 1150-1245PM'],
			'locations': ['HH 317'],
			'instructors': ['Kutulas, Judy', 'Wells, Colin'],
		},
		{
			'term': 20133,
			'clbid': 89957,
			'deptnum': 'ASIAN 220',
			'lab': false,
			'name': 'AsiaCon3:InterpretJourney',
			'credits': 1,
			'gradetype': 'Graded',
			'gereqs': ['ALS-A', 'ALS-L',
			'HBS',
			'MCG',
			'ORC',
			'WRI'],
			'times': ['T 1145-0110PM', 'Th 1245-0205PM'],
			'locations': ['HH 317', 'HH 317'],
			'instructors': ['Tegtmeyer Pak, Katherine S.', 'Wong, Ka F.'],
		},
		{
			'term': 20133,
			'clbid': 90339,
			'deptnum': 'JAPAN 232',
			'lab': false,
			'name': 'Intermed Japanese II',
			'credits': 1,
			'gradetype': 'Graded',
			'gereqs': ['FOL-J'],
			'times': ['MWF 0200-0255PM'],
			'locations': ['TOH 314'],
			'instructors': ['Bridges IV, William H.'],
		},
		{
			'term': 20133,
			'clbid': 90340,
			'deptnum': 'JAPAN 232',
			'lab': true,
			'name': 'Intermed Japanese II Lab',
			'credits': 0,
			'gradetype': 'No Grade',
			'gereqs': [],
			'times': ['T 0935-1030'],
			'locations': ['TOH 175'],
			'instructors': ['Bridges IV, William H.'],
		},
		{
			'term': 20133,
			'clbid': 90172,
			'deptnum': 'MATH 220B',
			'lab': false,
			'name': 'Elem Linear Algebra',
			'credits': 1,
			'gradetype': 'Graded',
			'gereqs': ['AQR'],
			'times': ['MWF 0905-1000'],
			'locations': ['TOH 186'],
			'instructors': ['Smith, Kay E.'],
		},
		{
			'term': 20141,
			'clbid': 97217,
			'deptnum': 'ASIAN 230',
			'lab': false,
			'name': 'The Philosophy of Anime',
			'credits': 1,
			'gradetype': 'Graded',
			'gereqs': ['ALS-L', 'MCG'],
			'times': ['MWF 0200-0255PM'],
			'locations': ['TOH 210'],
			'instructors': ['Bridges IV, William H.'],
		},
		{
			'term': 20141,
			'clbid': 97413,
			'deptnum': 'ASIAN 230',
			'lab': false,
			'name': 'FLC - Japanese',
			'credits': 0.25,
			'gradetype': 'Graded',
			'gereqs': [],
			'times': [],
			'locations': [],
			'instructors': ['Bridges IV, William H.'],
		},
		{
			'term': 20141,
			'clbid': 97120,
			'deptnum': 'CSCI 300',
			'lab': false,
			'name': 'Top: Mobile Web Graphics',
			'credits': 1,
			'gradetype': 'Graded',
			'gereqs': [],
			'times': ['T 0800-0925', 'Th 0800-0920'],
			'locations': ['RNS 203', 'RNS 203'],
			'instructors': ['Advisor, Name O.'],
		},
		{
			'term': 20141,
			'clbid': 97119,
			'deptnum': 'CSCI 315',
			'lab': false,
			'name': 'Bioinformatics',
			'credits': 1,
			'gradetype': 'Graded',
			'gereqs': ['IST'],
			'times': ['T 0935-1100', 'Th 0930-1050'],
			'locations': ['RNS 203', 'RNS 203'],
			'instructors': ['Allen, Richard'],
		},
		{
			'term': 20141,
			'clbid': 97125,
			'deptnum': 'MATH 282',
			'lab': false,
			'name': 'Top: Intro Abstract Math',
			'credits': 1,
			'gradetype': 'Graded',
			'gereqs': [],
			'times': ['MWF 1255-0150PM'],
			'locations': ['RNS 206'],
			'instructors': ['Dietz, Jill'],
		},
		{
			'term': 20142,
			'clbid': 99351,
			'deptnum': 'CHEM 398B',
			'lab': false,
			'name': 'IR/Software Development',
			'credits': 1,
			'gradetype': 'Graded',
			'gereqs': [],
			'times': [],
			'locations': [],
			'instructors': ['Hanson, Robert'],
		},
		{
			'term': 20143,
			'clbid': 97582,
			'deptnum': 'ART 161',
			'lab': false,
			'name': 'World Architecture',
			'credits': 1,
			'gradetype': 'Graded',
			'gereqs': ['ALS-A'],
			'times': ['MWF 1150-1245PM'],
			'locations': ['DC 305'],
			'instructors': ['Kucera, Karil J.'],
		},
		{
			'term': 20143,
			'clbid': 97407,
			'deptnum': 'ASIAN 268',
			'lab': false,
			'name': 'Asian Calligraphy',
			'credits': 1,
			'gradetype': 'Audit',
			'gereqs': ['ALS-A', 'MCG'],
			'times': ['M 0700-1000PM'],
			'locations': ['RNS 210'],
			'instructors': ['Nishioka, Keiko'],
		},
		{
			'term': 20143,
			'clbid': 95594,
			'deptnum': 'CSCI 253A',
			'lab': false,
			'name': 'Algorithms/Data Struc',
			'credits': 1,
			'gradetype': 'S/U',
			'gereqs': [],
			'times': ['MWF 1255-0150PM'],
			'locations': ['RNS 203'],
			'instructors': ['Advisor, Name O.'],
		},
		{
			'term': 20143,
			'clbid': 95842,
			'deptnum': 'CSCI 263',
			'lab': false,
			'name': 'Ethical Iss: Software',
			'credits': 1,
			'gradetype': 'Graded',
			'gereqs': ['EIN', 'ORC'],
			'times': ['T 1145-0110PM', 'Th 1245-0205PM'],
			'locations': ['RNS 204', 'RNS 204'],
			'instructors': ['Huff, Charles'],
		},
		{
			'term': 20143,
			'clbid': 97333,
			'deptnum': 'REL 209',
			'lab': false,
			'name': 'Intro Feminist Theol',
			'credits': 1,
			'gradetype': 'Graded',
			'gereqs': ['BTS-T'],
			'times': ['MWF 1045-1140'],
			'locations': ['OM 010'],
			'instructors': ['Booth, David'],
		},
		{
			'term': 20151,
			'clbid': 102748,
			'deptnum': 'CSCI 273',
			'lab': false,
			'name': 'Operating Systems',
			'credits': 1,
			'gradetype': 'Graded',
			'gereqs': [],
			'times': ['T 0935-1100', 'Th 0930-1050'],
			'locations': ['RNS 203', 'RNS 203'],
			'instructors': ['Brown, Richard'],
		},
		{
			'term': 20151,
			'clbid': 100423,
			'deptnum': 'CSCI 390A',
			'lab': false,
			'name': 'Sem: Senior Capstone',
			'credits': 1,
			'gradetype': 'Graded',
			'gereqs': ['WRI'],
			'times': ['MWF 0905-1000'],
			'locations': ['RMS 201'],
			'instructors': ['Advisor, Name O.'],
		},
		{
			'term': 20151,
			'clbid': 100346,
			'deptnum': 'DANCE 115',
			'lab': false,
			'name': 'Power Play',
			'credits': 0.25,
			'gradetype': 'P/N',
			'gereqs': ['SPM'],
			'times': ['T 1145-0110PM', 'Th 1245-0205PM'],
			'locations': ['DC Studio 3', 'DC Studio 3'],
			'instructors': ['Saterstrom, Sheryl'],
		},
		{
			'term': 20151,
			'clbid': 103276,
			'deptnum': 'HIST 237',
			'lab': false,
			'name': 'Women/Medieval Europe',
			'credits': 1,
			'gradetype': 'Graded',
			'gereqs': ['HWC'],
			'times': ['MWF 1045-1140'],
			'locations': ['RNS 190'],
			'instructors': ['Mummey, Kevin'],
		},
		{
			'term': 20151,
			'clbid': 99504,
			'deptnum': 'JAPAN 301',
			'lab': false,
			'name': 'Advanced Japanese I',
			'credits': 1,
			'gradetype': 'Audit',
			'gereqs': ['FOL-J'],
			'times': ['MWF 1150-1245PM'],
			'locations': ['TOH 300'],
			'instructors': ['Akimoto, Hiroe'],
		},
		{
			'term': 20152,
			'clbid': 101017,
			'deptnum': 'PHYS 252',
			'lab': false,
			'name': 'Musical Acoustics',
			'credits': 1,
			'gradetype': 'Graded',
			'gereqs': ['IST', 'SED'],
			'times': ['M-F 1040-1210PM'],
			'locations': ['RNS 210'],
			'instructors': ['Adhikari, Prabal'],
		},
		{
			'term': 20152,
			'clbid': 101018,
			'deptnum': 'PHYS 252',
			'lab': true,
			'name': 'Musical Acoustics Lab',
			'credits': 0,
			'gradetype': 'No Grade',
			'gereqs': [],
			'times': ['M-F 0100-0330PM'],
			'locations': ['RNS 292'],
			'instructors': ['Adhikari, Prabal'],
		},
		{
			'term': 20153,
			'clbid': 103314,
			'deptnum': 'AS/PS 245',
			'lab': false,
			'name': 'Asian Regionalism',
			'credits': 1,
			'gradetype': 'Graded',
			'gereqs': ['HBS', 'MCG'],
			'times': ['T 0120-0245PM', 'Th 0215-0335PM'],
			'locations': ['TOH 308', 'TOH 308'],
			'instructors': ['Tegtmeyer Pak, Katherine S.'],
		},
		{
			'term': 20153,
			'clbid': 103404,
			'deptnum': 'ASIAN 240',
			'lab': false,
			'name': 'Talking in Japan/US',
			'credits': 1,
			'gradetype': 'Graded',
			'gereqs': ['HBS', 'MCG',
			'ORC'],
			'times': ['MWF 0800-0855'],
			'locations': ['TOH 316'],
			'instructors': ['Boteilho, Caleb'],
		},
		{
			'term': 20153,
			'clbid': 104968,
			'deptnum': 'ASIAN 240',
			'lab': false,
			'name': 'FLC - Japanese',
			'credits': 0.25,
			'gradetype': 'Graded',
			'gereqs': [],
			'times': [],
			'locations': [],
			'instructors': ['Boteilho, Caleb'],
		},
		{
			'term': 20153,
			'clbid': 102075,
			'deptnum': 'ASIAN 399',
			'lab': false,
			'name': 'Sem: Asia',
			'credits': 1,
			'gradetype': 'Graded',
			'gereqs': ['WRI'],
			'times': ['T 0935-1100', 'Th 0930-1050'],
			'locations': ['TOH 110', 'TOH 110'],
			'instructors': ['Entenmann, Robert'],
		},
		{
			'term': 20153,
			'clbid': 103170,
			'deptnum': 'CSCI 276A',
			'lab': false,
			'name': 'Programming Languages',
			'credits': 1,
			'gradetype': 'Graded',
			'gereqs': [],
			'times': ['T 0800-0925', 'Th 0800-0920'],
			'locations': ['RNS 203', 'RNS 203'],
			'instructors': ['Allen, Richard'],
		},
		{
			'term': 20153,
			'clbid': 103157,
			'deptnum': 'DANCE 215',
			'lab': false,
			'name': 'Contact Improvisation',
			'credits': 0.25,
			'gradetype': 'Graded',
			'gereqs': ['SPM'],
			'times': ['T 1145-0110PM', 'Th 1245-0205PM'],
			'locations': ['DC Studio 3', 'DC Studio 3'],
			'instructors': ['Saterstrom, Sheryl'],
		},
	],
	degrees: [
		{
			'academic standing': 'Good',
			'advisor': 'Advisor, Name O.',
			'concentrations': ['Japan Studies'],
			'degree': 'Bachelor of Arts',
			'emphases': [],
			'graduation': 2016,
			'majors': ['Computer Science', 'Asian Studies'],
			'matriculation': 2012,
			'name': 'Student M. Name',
		},
	],
})

xdescribe('convertStudent', () => {
	it('converts a student from the imported data to a Gobbldygook student', () => {
		const actual = convertStudent(sample)
		const expected = {
			'id': 'da42d72c-ac71-48bf-8df7-6f4da1a7bd1e',
			'name': 'Student M. Name',
			'version': '3.0.0-beta4',
			'creditsNeeded': 35,
			'matriculation': 2012,
			'graduation': 2016,
			'advisor': 'Advisor, Name O.',
			'dateLastModified': '2016-01-01T17:03:27.011Z',
			'dateCreated': '2016-01-01T17:03:27.011Z',
			'studies': [
				{'name': 'Bachelor of Arts', 'type': 'degree'},
				{'name': 'Computer Science', 'type': 'major'},
				{'name': 'Asian Studies', 'type': 'major'},
				{'name': 'Japan Studies', 'type': 'concentration'},
			],
			'schedules': {
				'27cb6d96-4662-4106-91ce-eca37dc5226e': {
					'id': '27cb6d96-4662-4106-91ce-eca37dc5226e',
					'active': true,
					'index': 1,
					'title': 'Schedule 0',
					'clbids': [87891, 81526],
					'year': 2011,
					'semester': 9,
				},
				'fb7c49a7-7394-406b-b638-32755ddb6de4': {
					'id': 'fb7c49a7-7394-406b-b638-32755ddb6de4',
					'active': true,
					'index': 1,
					'title': 'Schedule G',
					'clbids': [82908, 83505, 82768, 82771, 82792],
					'year': 2012,
					'semester': 1,
				},
				'56397d69-0add-4631-b352-61ed778c38ad': {
					'id': '56397d69-0add-4631-b352-61ed778c38ad',
					'active': true,
					'index': 1,
					'title': 'Schedule I',
					'clbids': [85898],
					'year': 2012,
					'semester': 2,
				},
				'1ade1786-0151-44b9-b6de-a73620a0ac0f': {
					'id': '1ade1786-0151-44b9-b6de-a73620a0ac0f',
					'active': true,
					'index': 1,
					'title': 'Schedule S',
					'clbids': [84513, 84461, 85991, 85992, 84378, 84381],
					'year': 2012,
					'semester': 3,
				},
				'ca04b0cf-aa9b-4c71-8312-a021c81802cf': {
					'id': 'ca04b0cf-aa9b-4c71-8312-a021c81802cf',
					'active': true,
					'index': 1,
					'title': 'Schedule 3',
					'clbids': [89090, 88273, 88630, 88593, 88681, 88682],
					'year': 2013,
					'semester': 1,
				},
				'a7a61309-02c9-4a60-af9b-ac39941b6c94': {
					'id': 'a7a61309-02c9-4a60-af9b-ac39941b6c94',
					'active': true,
					'index': 1,
					'title': 'Schedule Z',
					'clbids': [89466],
					'year': 2013,
					'semester': 2,
				},
				'a0e5668c-8b0a-4489-859c-42337c0fcc78': {
					'id': 'a0e5668c-8b0a-4489-859c-42337c0fcc78',
					'active': true,
					'index': 1,
					'title': 'Schedule T',
					'clbids': [90719, 89957, 90339, 90340, 90172],
					'year': 2013,
					'semester': 3,
				},
				'd351f0ca-f8ca-480a-b6cf-e82a4e7c1d2e': {
					'id': 'd351f0ca-f8ca-480a-b6cf-e82a4e7c1d2e',
					'active': true,
					'index': 1,
					'title': 'Schedule L',
					'clbids': [97217, 97413, 97120, 97119, 97125],
					'year': 2014,
					'semester': 1,
				},
				'2a663761-e7e6-416b-a73d-eda4d6562161': {
					'id': '2a663761-e7e6-416b-a73d-eda4d6562161',
					'active': true,
					'index': 1,
					'title': 'Schedule W',
					'clbids': [99351],
					'year': 2014,
					'semester': 2,
				},
				'868fc315-4ee2-4dc3-b51b-b4ca81746437': {
					'id': '868fc315-4ee2-4dc3-b51b-b4ca81746437',
					'active': true,
					'index': 1,
					'title': 'Schedule 5',
					'clbids': [97582, 97407, 95594, 95842, 97333],
					'year': 2014,
					'semester': 3,
				},
				'c5c050fa-e15a-48cc-a18a-5b2936e7deb0': {
					'id': 'c5c050fa-e15a-48cc-a18a-5b2936e7deb0',
					'active': true,
					'index': 1,
					'title': 'Schedule G',
					'clbids': [102748, 100423, 100346, 103276, 99504],
					'year': 2015,
					'semester': 1,
				},
				'6280b31e-e95e-4fd0-bb86-022687be7fe7': {
					'id': '6280b31e-e95e-4fd0-bb86-022687be7fe7',
					'active': true,
					'index': 1,
					'title': 'Schedule D',
					'clbids': [101017, 101018],
					'year': 2015,
					'semester': 2,
				},
				'673c7bc8-a631-4338-a49d-544a512fcac0': {
					'id': '673c7bc8-a631-4338-a49d-544a512fcac0',
					'active': true,
					'index': 1,
					'title': 'Schedule O',
					'clbids': [103314, 103404, 104968, 102075, 103170, 103157],
					'year': 2015,
					'semester': 3,
				},
			},
			'overrides': {},
			'fabrications': {},
			'settings': {},
		}
		expect(actual).to.deep.equal(expected)
	})
})
