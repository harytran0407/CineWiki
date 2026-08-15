import { Award } from './types';

export interface KnownActorInfo {
  name?: string;
  birthday?: string;
  deathday?: string;
  place_of_birth?: string;
  nationality?: string;
  oscar_count?: number;
  acting_style?: string;
  total_box_office?: string;
  highest_grossing_movie?: string;
  landmark_works?: string[];
  biography_vi?: string;
  awards?: Award[];
}

export const KNOWN_ACTORS_MAP: Record<string, KnownActorInfo> = {
  '14341': { // Katharine Hepburn
    name: 'Katharine Hepburn',
    birthday: '1907-05-12',
    deathday: '2003-06-29',
    nationality: 'Mỹ',
    oscar_count: 4,
    acting_style: 'Huyền thoại điện ảnh số 1 lịch sử Hollywood với lối diễn bản lĩnh và tinh tế.',
    total_box_office: '$800 Tr USD',
    landmark_works: ['Morning Glory (1933)', 'Guess Who\'s Coming to Dinner (1967)', 'The Lion in Winter (1968)', 'On Golden Pond (1981)'],
    biography_vi: 'Katharine Hepburn (1907 - 2003) là huyền thoại nữ diễn viên giữ kỷ kỷ lục lịch sử với 4 giải Oscar Nữ diễn viên chính xuất sắc nhất.',
    awards: [
      { id: 'awd-kh-1', name: 'Oscar (Academy Awards)', category: 'Nữ diễn viên chính xuất sắc nhất', year: 1982, movie_title: 'On Golden Pond', status: 'won', source: 'AMPAS' },
      { id: 'awd-kh-2', name: 'Oscar (Academy Awards)', category: 'Nữ diễn viên chính xuất sắc nhất', year: 1969, movie_title: 'The Lion in Winter', status: 'won', source: 'AMPAS' },
      { id: 'awd-kh-3', name: 'Oscar (Academy Awards)', category: 'Nữ diễn viên chính xuất sắc nhất', year: 1968, movie_title: 'Guess Who\'s Coming to Dinner', status: 'won', source: 'AMPAS' },
      { id: 'awd-kh-4', name: 'Oscar (Academy Awards)', category: 'Nữ diễn viên chính xuất sắc nhất', year: 1934, movie_title: 'Morning Glory', status: 'won', source: 'AMPAS' }
    ]
  },
  '5064': { // Meryl Streep
    birthday: '1949-06-22',
    nationality: 'Mỹ',
    oscar_count: 3,
    acting_style: 'Kỷ kỷ lục gia giải thưởng, nổi tiếng với khả năng giả giọng hoàn hảo.',
    total_box_office: '$3.8 Tỷ USD',
    highest_grossing_movie: 'Mamma Mia! ($611 Tr USD)',
    biography_vi: 'Meryl Streep là nữ diễn viên huyền thoại giữ kỷ kỷ lục 21 đề cử Oscar (giành 3 giải).',
    awards: [
      { id: 'awd-ms-1', name: 'Oscar (Academy Awards)', category: 'Nữ diễn viên chính xuất sắc nhất', year: 2012, movie_title: 'The Iron Lady', status: 'won', source: 'AMPAS' },
      { id: 'awd-ms-2', name: 'Oscar (Academy Awards)', category: 'Nữ diễn viên chính xuất sắc nhất', year: 1983, movie_title: 'Sophie\'s Choice', status: 'won', source: 'AMPAS' },
      { id: 'awd-ms-3', name: 'Oscar (Academy Awards)', category: 'Nữ diễn viên phụ xuất sắc nhất', year: 1980, movie_title: 'Kramer vs. Kramer', status: 'won', source: 'AMPAS' }
    ]
  },
  '514': { // Jack Nicholson
    birthday: '1937-04-22',
    nationality: 'Mỹ',
    oscar_count: 3,
    landmark_works: ['One Flew Over the Cuckoo\'s Nest (1975)', 'Terms of Endearment (1983)', 'As Good as It Gets (1997)'],
    awards: [
      { id: 'awd-jn-1', name: 'Oscar (Academy Awards)', category: 'Nam diễn viên chính xuất sắc nhất', year: 1998, movie_title: 'As Good as It Gets', status: 'won', source: 'AMPAS' },
      { id: 'awd-jn-2', name: 'Oscar (Academy Awards)', category: 'Nam diễn viên phụ xuất sắc nhất', year: 1984, movie_title: 'Terms of Endearment', status: 'won', source: 'AMPAS' },
      { id: 'awd-jn-3', name: 'Oscar (Academy Awards)', category: 'Nam diễn viên chính xuất sắc nhất', year: 1976, movie_title: 'One Flew Over the Cuckoo\'s Nest', status: 'won', source: 'AMPAS' }
    ]
  },
  '11856': { // Daniel Day-Lewis (TMDB ID 11856)
    name: 'Daniel Day-Lewis',
    birthday: '1957-04-29',
    nationality: 'Anh',
    oscar_count: 3,
    acting_style: 'Phương pháp diễn xuất dấn thân tuyệt đối.',
    total_box_office: '$1.2 Tỷ USD',
    highest_grossing_movie: 'Lincoln ($275 Tr USD)',
    landmark_works: ['My Left Foot (1989)', 'There Will Be Blood (2007)', 'Lincoln (2012)'],
    biography_vi: 'Daniel Day-Lewis (sinh ngày 29 tháng 4 năm 1957) là nam diễn viên duy nhất trong lịch sử giành 3 giải Oscar Nam diễn viên chính xuất sắc nhất.',
    awards: [
      { id: 'awd-ddl-1', name: 'Oscar (Academy Awards)', category: 'Nam diễn viên chính xuất sắc nhất', year: 2013, movie_title: 'Lincoln', status: 'won', source: 'AMPAS' },
      { id: 'awd-ddl-2', name: 'Oscar (Academy Awards)', category: 'Nam diễn viên chính xuất sắc nhất', year: 2008, movie_title: 'There Will Be Blood', status: 'won', source: 'AMPAS' },
      { id: 'awd-ddl-3', name: 'Oscar (Academy Awards)', category: 'Nam diễn viên chính xuất sắc nhất', year: 1990, movie_title: 'My Left Foot', status: 'won', source: 'AMPAS' }
    ]
  },
  '4173': { // Frances McDormand
    birthday: '1957-06-23',
    nationality: 'Mỹ',
    oscar_count: 3,
    landmark_works: ['Fargo (1996)', 'Three Billboards Outside Ebbing, Missouri (2017)', 'Nomadland (2020)'],
    awards: [
      { id: 'awd-fm-1', name: 'Oscar (Academy Awards)', category: 'Nữ diễn viên chính xuất sắc nhất', year: 2021, movie_title: 'Nomadland', status: 'won', source: 'AMPAS' },
      { id: 'awd-fm-2', name: 'Oscar (Academy Awards)', category: 'Nữ diễn viên chính xuất sắc nhất', year: 2018, movie_title: 'Three Billboards', status: 'won', source: 'AMPAS' },
      { id: 'awd-fm-3', name: 'Oscar (Academy Awards)', category: 'Nữ diễn viên chính xuất sắc nhất', year: 1997, movie_title: 'Fargo', status: 'won', source: 'AMPAS' }
    ]
  },
  '31': { // Tom Hanks
    birthday: '1956-07-09',
    nationality: 'Mỹ',
    oscar_count: 2,
    acting_style: 'Khả năng hóa thân xuất sắc vào các nhân vật biểu tượng mang đậm tính nhân văn.',
    total_box_office: '$9.9 Tỷ USD',
    highest_grossing_movie: 'Toy Story 4 ($1.07 Tỷ USD)',
    landmark_works: ['Forrest Gump (1994)', 'Saving Private Ryan (1998)', 'Cast Away (2000)', 'Philadelphia (1993)'],
    biography_vi: 'Tom Hanks là huyền thoại điện ảnh Hollywood giành 2 giải Oscar Nam chính xuất sắc nhất liên tiếp.',
    awards: [
      { id: 'awd-th-1', name: 'Oscar (Academy Awards)', category: 'Nam diễn viên chính xuất sắc nhất', year: 1995, movie_title: 'Forrest Gump', status: 'won', source: 'AMPAS' },
      { id: 'awd-th-2', name: 'Oscar (Academy Awards)', category: 'Nam diễn viên chính xuất sắc nhất', year: 1994, movie_title: 'Philadelphia', status: 'won', source: 'AMPAS' }
    ]
  },
  '5292': { // Denzel Washington
    birthday: '1954-12-28',
    nationality: 'Mỹ',
    oscar_count: 2,
    landmark_works: ['Training Day (2001)', 'Malcolm X (1992)', 'Glory (1989)'],
    awards: [
      { id: 'awd-dw-1', name: 'Oscar (Academy Awards)', category: 'Nam diễn viên chính xuất sắc nhất', year: 2002, movie_title: 'Training Day', status: 'won', source: 'AMPAS' },
      { id: 'awd-dw-2', name: 'Oscar (Academy Awards)', category: 'Nam diễn viên phụ xuất sắc nhất', year: 1990, movie_title: 'Glory', status: 'won', source: 'AMPAS' }
    ]
  },
  '380': { // Robert De Niro
    birthday: '1943-08-17',
    nationality: 'Mỹ',
    oscar_count: 2,
    landmark_works: ['Taxi Driver (1976)', 'Raging Bull (1980)', 'The Godfather Part II (1974)'],
    awards: [
      { id: 'awd-rdn-1', name: 'Oscar (Academy Awards)', category: 'Nam diễn viên chính xuất sắc nhất', year: 1981, movie_title: 'Raging Bull', status: 'won', source: 'AMPAS' },
      { id: 'awd-rdn-2', name: 'Oscar (Academy Awards)', category: 'Nam diễn viên phụ xuất sắc nhất', year: 1975, movie_title: 'The Godfather Part II', status: 'won', source: 'AMPAS' }
    ]
  },
  '3061': { // Anthony Hopkins
    birthday: '1937-12-31',
    nationality: 'Anh',
    oscar_count: 2,
    awards: [
      { id: 'awd-ah-1', name: 'Oscar (Academy Awards)', category: 'Nam diễn viên chính xuất sắc nhất', year: 2021, movie_title: 'The Father', status: 'won', source: 'AMPAS' },
      { id: 'awd-ah-2', name: 'Oscar (Academy Awards)', category: 'Nam diễn viên chính xuất sắc nhất', year: 1992, movie_title: 'The Silence of the Lambs', status: 'won', source: 'AMPAS' }
    ]
  },
  '54693': { // Emma Stone
    birthday: '1988-11-06',
    nationality: 'Mỹ',
    oscar_count: 2,
    awards: [
      { id: 'awd-es-1', name: 'Oscar (Academy Awards)', category: 'Nữ diễn viên chính xuất sắc nhất', year: 2024, movie_title: 'Poor Things', status: 'won', source: 'AMPAS' },
      { id: 'awd-es-2', name: 'Oscar (Academy Awards)', category: 'Nữ diễn viên chính xuất sắc nhất', year: 2017, movie_title: 'La La Land', status: 'won', source: 'AMPAS' }
    ]
  },
  '1245': { // Scarlett Johansson
    name: 'Scarlett Johansson',
    birthday: '1984-11-22',
    nationality: 'Mỹ',
    total_box_office: '$14.5 Tỷ USD',
    highest_grossing_movie: 'Avengers: Endgame ($2.79 Tỷ USD)',
    landmark_works: ['Avengers: Endgame (2019)', 'Marriage Story (2019)', 'Lucy (2014)'],
    biography_vi: 'Scarlett Johansson là nữ diễn viên giữ kỷ kỷ lục tổng doanh thu phòng vé cá nhân cao nhất lịch sử điện ảnh thế giới với $14.5 Tỷ USD toàn cầu.'
  },
  '3223': { // Robert Downey Jr.
    name: 'Robert Downey Jr.',
    birthday: '1965-04-04',
    nationality: 'Mỹ',
    oscar_count: 1,
    total_box_office: '$14.3 Tỷ USD',
    highest_grossing_movie: 'Avengers: Endgame ($2.79 Tỷ USD)',
    landmark_works: ['Iron Man (2008)', 'Avengers: Endgame (2019)', 'Oppenheimer (2023)'],
    biography_vi: 'Robert Downey Jr. là siêu sao biểu tượng người Mỹ với doanh thu $14.3 Tỷ USD và đoạt giải Oscar Nam phụ xuất sắc nhất với Oppenheimer.',
    awards: [
      { id: 'awd-rdj-1', name: 'Oscar (Academy Awards)', category: 'Nam diễn viên phụ xuất sắc nhất', year: 2024, movie_title: 'Oppenheimer', status: 'won', source: 'AMPAS' }
    ]
  },
  '2231': { // Samuel L. Jackson
    name: 'Samuel L. Jackson',
    birthday: '1948-12-21',
    nationality: 'Mỹ',
    total_box_office: '$14.3 Tỷ USD',
    highest_grossing_movie: 'Avengers: Endgame ($2.79 Tỷ USD)',
    landmark_works: ['Pulp Fiction (1994)', 'Avengers Series', 'Star Wars Series'],
    biography_vi: 'Samuel L. Jackson là huyền thoại điện ảnh Mỹ đạt tổng doanh thu kỷ kỷ lục phòng vé $14.3 Tỷ USD.'
  },
  '8691': { // Zoe Saldana
    name: 'Zoe Saldana',
    birthday: '1978-06-19',
    nationality: 'Mỹ',
    total_box_office: '$14.1 Tỷ USD',
    highest_grossing_movie: 'Avatar ($2.92 Tỷ USD)',
    landmark_works: ['Avatar (2009)', 'Avatar: The Way of Water (2022)', 'Avengers: Endgame (2019)'],
    biography_vi: 'Zoe Saldana là nữ diễn viên duy nhất trong lịch sử từng đóng chính 4 bộ phim cán mốc $2 Tỷ USD toàn cầu.'
  },
  '73968': { // Chris Pratt
    name: 'Chris Pratt',
    birthday: '1979-06-21',
    nationality: 'Mỹ',
    total_box_office: '$13.2 Tỷ USD',
    highest_grossing_movie: 'Avengers: Endgame ($2.79 Tỷ USD)',
    landmark_works: ['Jurassic World (2015)', 'Guardians of the Galaxy (2014)', 'Super Mario Bros (2023)'],
    biography_vi: 'Chris Pratt là tài tử hàng đầu nắm giữ chuỗi bom tấn kỷ kỷ lục phòng vé toàn cầu $13.2 Tỷ USD.'
  },
  '500': { // Tom Cruise
    name: 'Tom Cruise',
    birthday: '1962-07-03',
    nationality: 'Mỹ',
    total_box_office: '$12.1 Tỷ USD',
    highest_grossing_movie: 'Top Gun: Maverick ($1.49 Tỷ USD)',
    landmark_works: ['Top Gun: Maverick (2022)', 'Mission: Impossible Series (1996-2023)'],
    biography_vi: 'Tom Cruise là siêu sao hành động duy nhất duy trì vị thế đỉnh cao phòng vé suốt 4 thập kỷ.'
  },
  '1136406': { // Tom Holland
    birthday: '1996-06-01',
    nationality: 'Anh',
    total_box_office: '$9.6 Tỷ USD',
    highest_grossing_movie: 'Spider-Man: No Way Home ($1.92 Tỷ USD)',
    landmark_works: ['Spider-Man: No Way Home (2021)', 'Uncharted (2022)', 'Avengers: Endgame (2019)'],
    biography_vi: 'Tom Holland là nam diễn viên hàng đầu người Anh nổi tiếng thế giới với vai diễn Người Nhện trong MCU.'
  },
  '6193': { // Leonardo DiCaprio
    birthday: '1974-11-11',
    nationality: 'Mỹ',
    oscar_count: 1,
    total_box_office: '$7.5 Tỷ USD',
    landmark_works: ['Titanic (1997)', 'Inception (2010)', 'The Revenant (2015)'],
    biography_vi: 'Leonardo DiCaprio là tài tử vĩ đại đoạt giải Oscar cho vai chính trong The Revenant (2016).',
    awards: [
      { id: 'awd-ld-1', name: 'Oscar (Academy Awards)', category: 'Nam diễn viên chính xuất sắc nhất', year: 2016, movie_title: 'The Revenant', status: 'won', source: 'AMPAS' }
    ]
  },
  '1620': { // Michelle Yeoh (Dương Tử Quỳnh)
    birthday: '1962-08-06',
    nationality: 'Malaysia',
    oscar_count: 1,
    landmark_works: ['Everything Everywhere All at Once (2022)', 'Crouching Tiger, Hidden Dragon (2000)'],
    biography_vi: 'Dương Tử Quỳnh (Michelle Yeoh) là nữ diễn viên châu Á đầu tiên giành giải Oscar Nữ diễn viên chính xuất sắc nhất (2023).',
    awards: [
      { id: 'awd-my-1', name: 'Oscar (Academy Awards)', category: 'Nữ diễn viên chính xuất sắc nhất', year: 2023, movie_title: 'Everything Everywhere All at Once', status: 'won', source: 'AMPAS' }
    ]
  },
  '2038': { // Cillian Murphy
    birthday: '1976-05-25',
    nationality: 'Ireland',
    oscar_count: 1,
    landmark_works: ['Oppenheimer (2023)', 'Peaky Blinders (2013-2022)', 'Inception (2010)'],
    biography_vi: 'Cillian Murphy là nam diễn viên đoạt giải Oscar Nam diễn viên chính xuất sắc nhất cho Oppenheimer (2024).',
    awards: [
      { id: 'awd-cm-1', name: 'Oscar (Academy Awards)', category: 'Nam diễn viên chính xuất sắc nhất', year: 2024, movie_title: 'Oppenheimer', status: 'won', source: 'AMPAS' }
    ]
  },
  '287': { // Brad Pitt
    birthday: '1963-12-18',
    nationality: 'Mỹ',
    oscar_count: 1,
    total_box_office: '$5.1 Tỷ USD',
    landmark_works: ['Fight Club (1999)', 'Se7en (1995)', 'Once Upon a Time in Hollywood (2019)'],
    awards: [
      { id: 'awd-bp-1', name: 'Oscar (Academy Awards)', category: 'Nam diễn viên phụ xuất sắc nhất', year: 2020, movie_title: 'Once Upon a Time in Hollywood', status: 'won', source: 'AMPAS' }
    ]
  },
  '1810': { // Heath Ledger
    birthday: '1979-04-04',
    deathday: '2008-01-22',
    nationality: 'Úc',
    oscar_count: 1,
    landmark_works: ['The Dark Knight (2008)', 'Brokeback Mountain (2005)'],
    awards: [
      { id: 'awd-hl-1', name: 'Oscar (Academy Awards)', category: 'Nam diễn viên phụ xuất sắc nhất', year: 2009, movie_title: 'The Dark Knight', status: 'won', source: 'AMPAS' }
    ]
  },
  '14115': { // Ke Huy Quan
    birthday: '1971-08-20',
    nationality: 'Mỹ',
    oscar_count: 1,
    landmark_works: ['Everything Everywhere All at Once (2022)', 'Indiana Jones (1984)'],
    awards: [
      { id: 'awd-khq-1', name: 'Oscar (Academy Awards)', category: 'Nam diễn viên phụ xuất sắc nhất', year: 2023, movie_title: 'Everything Everywhere All at Once', status: 'won', source: 'AMPAS' }
    ]
  },
  '3894': { // Christian Bale
    birthday: '1974-01-30',
    nationality: 'Anh',
    oscar_count: 1,
    landmark_works: ['The Dark Knight Trilogy (2005-2012)', 'The Fighter (2010)'],
    awards: [
      { id: 'awd-cb-1', name: 'Oscar (Academy Awards)', category: 'Nam diễn viên phụ xuất sắc nhất', year: 2011, movie_title: 'The Fighter', status: 'won', source: 'AMPAS' }
    ]
  },
  '1158': { // Al Pacino
    birthday: '1940-04-25',
    nationality: 'Mỹ',
    oscar_count: 1,
    landmark_works: ['The Godfather Series (1972-1990)', 'Scent of a Woman (1992)'],
    awards: [
      { id: 'awd-ap-1', name: 'Oscar (Academy Awards)', category: 'Nam diễn viên chính xuất sắc nhất', year: 1993, movie_title: 'Scent of a Woman', status: 'won', source: 'AMPAS' }
    ]
  },
  '620': { // Ewan McGregor
    birthday: '1971-03-31',
    nationality: 'Anh',
    oscar_count: 0,
    landmark_works: ['Star Wars Prequel Trilogy (1999-2005)', 'Trainspotting (1996)'],
    awards: [] // 0 Oscars!
  },
  '3025812': { // Tuấn Trần
    name: 'Tuấn Trần',
    birthday: '1992-11-20',
    place_of_birth: 'TP. Hồ Chí Minh, Việt Nam',
    nationality: 'Việt Nam',
    total_box_office: '$30 Triệu USD',
    highest_grossing_movie: 'Mai ($21 Triệu USD)',
    landmark_works: ['Mai (2024)', 'Bố Già (2021)', 'Đất Rừng Phương Nam (2023)'],
    biography_vi: 'Tuấn Trần (tên thật Trần Duy Tuấn, sinh ngày 20 tháng 11 năm 1992) là một nam diễn viên điện ảnh tài năng nổi tiếng của Việt Nam.'
  },
  '2986420': { // Trấn Thành
    name: 'Trấn Thành',
    birthday: '1987-02-05',
    place_of_birth: 'TP. Hồ Chí Minh, Việt Nam',
    nationality: 'Việt Nam',
    total_box_office: '$35 Triệu USD',
    highest_grossing_movie: 'Mai ($21 Triệu USD)',
    landmark_works: ['Mai (2024)', 'Nhà Bà Nữ (2023)', 'Bố Già (2021)'],
    biography_vi: 'Trấn Thành (sinh ngày 5 tháng 2 năm 1987) là nam diễn viên, đạo diễn, nhà sản xuất phim hàng đầu Việt Nam.'
  },
  '1501170': { // Ninh Dương Lan Ngọc
    name: 'Ninh Dương Lan Ngọc',
    birthday: '1990-04-04',
    place_of_birth: 'TP. Hồ Chí Minh, Việt Nam',
    nationality: 'Việt Nam',
    total_box_office: '$18 Triệu USD',
    landmark_works: ['Cánh Đồng Bất Tận (2010)', 'Gái Già Lắm Chiêu 3 (2020)'],
    biography_vi: 'Ninh Dương Lan Ngọc (sinh ngày 4 tháng 4 năm 1990) là nữ diễn viên điện ảnh hàng đầu Việt Nam.'
  },
  '1501173': { // Thái Hòa
    name: 'Thái Hòa',
    birthday: '1974-08-10',
    place_of_birth: 'TP. Hồ Chí Minh, Việt Nam',
    nationality: 'Việt Nam',
    total_box_office: '$28 Triệu USD',
    landmark_works: ['Để Mai Tính (2010)', 'Tèo Em (2013)', 'Tiệc Trăng Máu (2020)'],
    biography_vi: 'Thái Hòa (sinh ngày 10 tháng 8 năm 1974) được mệnh danh là "Ông vua phòng vé" điện ảnh Việt Nam.'
  },
  '1803714': { // Kaity Nguyễn
    name: 'Kaity Nguyễn',
    birthday: '1999-04-09',
    place_of_birth: 'TP. Hồ Chí Minh, Việt Nam',
    nationality: 'Việt Nam',
    total_box_office: '$20 Triệu USD',
    landmark_works: ['Em Chưa 18 (2017)', 'Tiệc Trăng Máu (2020)', 'Người Vợ Cuối Cùng (2023)'],
    biography_vi: 'Kaity Nguyễn (sinh ngày 9 tháng 4 năm 1999) là nữ diễn viên tài năng xuất sắc của điện ảnh Việt Nam.'
  },
  '1120241': { // Ngô Thanh Vân
    name: 'Ngô Thanh Vân',
    birthday: '1979-02-26',
    place_of_birth: 'Trà Vinh, Việt Nam',
    nationality: 'Việt Nam',
    total_box_office: '$22 Triệu USD',
    landmark_works: ['Hai Phượng (2019)', 'Dòng Máu Anh Hùng (2007)'],
    biography_vi: 'Ngô Thanh Vân (sinh ngày 26 tháng 2 năm 1979) là "Đả nữ số 1 màn ảnh Việt".'
  },
  '1803716': { // Kiều Minh Tuấn
    name: 'Kiều Minh Tuấn',
    birthday: '1988-02-26',
    place_of_birth: 'Bà Rịa - Vũng Tàu, Việt Nam',
    nationality: 'Việt Nam',
    total_box_office: '$22 Triệu USD',
    landmark_works: ['Em Chưa 18 (2017)', 'Tiệc Trăng Máu (2020)'],
    biography_vi: 'Kiều Minh Tuấn (sinh ngày 26 tháng 2 năm 1988) là nam diễn viên thực lực.'
  }
};

export const VIETNAMESE_ACTORS: any[] = [];
