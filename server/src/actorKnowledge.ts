import { Award } from './types';

export interface KnownActorInfo {
  nationality?: string;
  acting_style?: string;
  total_box_office?: string;
  highest_grossing_movie?: string;
  landmark_works?: string[];
  biography_vi?: string;
  awards?: Award[];
}

export const KNOWN_ACTORS_MAP: Record<string, KnownActorInfo> = {
  '31': { // Tom Hanks
    nationality: 'Mỹ 🇺🇸',
    acting_style: 'Khả năng hóa thân xuất sắc vào các nhân vật biểu tượng mang đậm tính nhân văn, lối diễn tự nhiên, chân thực và chạm tới trái tim khán giả.',
    total_box_office: '$9.9 Tỷ USD',
    highest_grossing_movie: 'Toy Story 4 ($1.07 Tỷ USD)',
    landmark_works: [
      'Forrest Gump (1994)',
      'Saving Private Ryan (1998)',
      'Cast Away (2000)',
      'Philadelphia (1993)',
      'The Green Mile (1999)',
      'Toy Story Series (1995-2019)'
    ],
    biography_vi: 'Tom Hanks là một trong những huyền thoại điện ảnh vĩ đại nhất lịch sử Hollywood. Ông là một trong hai nam diễn viên duy nhất trong lịch sử từng giành 2 giải Oscar Nam chính xuất sắc nhất trong 2 năm liên tiếp (1994 với Philadelphia và 1995 với Forrest Gump). Với sự nghiệp trải dài hơn 4 thập kỷ, Tom Hanks được mệnh danh là "Người cha ruột của điện ảnh Mỹ".',
    awards: [
      {
        id: 'awd-th-1',
        name: 'Oscar (Academy Awards)',
        category: 'Nam diễn viên chính xuất sắc nhất',
        year: 1995,
        movie_title: 'Forrest Gump',
        status: 'won',
        source: 'AMPAS'
      },
      {
        id: 'awd-th-2',
        name: 'Oscar (Academy Awards)',
        category: 'Nam diễn viên chính xuất sắc nhất',
        year: 1994,
        movie_title: 'Philadelphia',
        status: 'won',
        source: 'AMPAS'
      },
      {
        id: 'awd-th-3',
        name: 'Golden Globe Awards',
        category: 'Nam diễn viên chính xuất sắc nhất - Phim Drama',
        year: 2001,
        movie_title: 'Cast Away',
        status: 'won',
        source: 'HFPA'
      },
      {
        id: 'awd-th-4',
        name: 'Golden Globe Awards',
        category: 'Nam diễn viên chính xuất sắc nhất - Phim Drama',
        year: 1995,
        movie_title: 'Forrest Gump',
        status: 'won',
        source: 'HFPA'
      },
      {
        id: 'awd-th-5',
        name: 'Golden Globe Awards',
        category: 'Nam diễn viên chính xuất sắc nhất - Phim Drama',
        year: 1994,
        movie_title: 'Philadelphia',
        status: 'won',
        source: 'HFPA'
      },
      {
        id: 'awd-th-6',
        name: 'Oscar (Academy Awards)',
        category: 'Nam diễn viên chính xuất sắc nhất',
        year: 1999,
        movie_title: 'Saving Private Ryan',
        status: 'won',
        source: 'AMPAS'
      },
      {
        id: 'awd-th-7',
        name: 'BAFTA Film Awards',
        category: 'Nam diễn viên chính xuất sắc nhất',
        year: 1995,
        movie_title: 'Forrest Gump',
        status: 'won',
        source: 'BAFTA'
      }
    ]
  },
  '5064': { // Meryl Streep
    nationality: 'Mỹ 🇺🇸',
    acting_style: 'Kỷ lục gia giải thưởng, nổi tiếng với khả năng giả giọng vùng miền hoàn hảo và biểu cảm tâm lý đỉnh cao.',
    total_box_office: '$3.8 Tỷ USD',
    highest_grossing_movie: 'Mamma Mia! ($611 Tr USD)',
    landmark_works: [
      'Sophie\'s Choice (1982)',
      'The Devil Wears Prada (2006)',
      'Kramer vs. Kramer (1979)',
      'The Iron Lady (2011)',
      'Out of Africa (1985)'
    ],
    biography_vi: 'Meryl Streep được coi là nữ diễn viên xuất sắc nhất thế hệ của mình. Bày tỏ kỹ năng hóa thân vô tiền khoáng hậu, bà giữ kỷ lục lịch sử với 21 đề cử giải Oscar (giành 3 giải) và 33 đề cử Quả Cầu Vàng (giành 9 giải).',
    awards: [
      { id: 'awd-ms-1', name: 'Oscar (Academy Awards)', category: 'Nữ diễn viên chính xuất sắc nhất', year: 2012, movie_title: 'The Iron Lady', status: 'won', source: 'AMPAS' },
      { id: 'awd-ms-2', name: 'Oscar (Academy Awards)', category: 'Nữ diễn viên chính xuất sắc nhất', year: 1983, movie_title: 'Sophie\'s Choice', status: 'won', source: 'AMPAS' },
      { id: 'awd-ms-3', name: 'Oscar (Academy Awards)', category: 'Nữ diễn viên phụ xuất sắc nhất', year: 1980, movie_title: 'Kramer vs. Kramer', status: 'won', source: 'AMPAS' }
    ]
  },
  '1158': { // Al Pacino
    nationality: 'Mỹ 🇺🇸',
    acting_style: 'Lối diễn bùng nổ, nội lực thâm sâu và giọng nói uy quyền cuốn hút.',
    total_box_office: '$2.5 Tỷ USD',
    highest_grossing_movie: 'The Godfather ($250 Tr USD)',
    landmark_works: [
      'The Godfather Series (1972-1990)',
      'Scarface (1983)',
      'Scent of a Woman (1992)',
      'Heat (1995)',
      'Dog Day Afternoon (1975)'
    ],
    biography_vi: 'Al Pacino là một trong những biểu tượng kinh điển nhất của dòng phim tội phạm và chính trị Hollywood, nổi tiếng thế giới với vai diễn Michael Corleone trong kiệt tác Bố Già (The Godfather).',
    awards: [
      { id: 'awd-ap-1', name: 'Oscar (Academy Awards)', category: 'Nam diễn viên chính xuất sắc nhất', year: 1993, movie_title: 'Scent of a Woman', status: 'won', source: 'AMPAS' },
      { id: 'awd-ap-2', name: 'BAFTA Film Awards', category: 'Nam diễn viên chính xuất sắc nhất', year: 1976, movie_title: 'The Godfather Part II', status: 'won', source: 'BAFTA' }
    ]
  },
  '380': { // Robert De Niro
    nationality: 'Mỹ 🇺🇸',
    acting_style: 'Phương pháp diễn xuất dấn thân nghiệt ngã (Method Acting), biến đổi ngoại hình cực đoan vì nhân vật.',
    total_box_office: '$4.2 Tỷ USD',
    highest_grossing_movie: 'Joker ($1.07 Tỷ USD)',
    landmark_works: [
      'Taxi Driver (1976)',
      'Raging Bull (1980)',
      'The Godfather Part II (1974)',
      'Goodfellas (1990)',
      'Heat (1995)'
    ],
    biography_vi: 'Robert De Niro là nam diễn viên gạo cội huyền thoại, từng giành 2 giải Oscar và hợp tác ăn ý với đạo diễn Martin Scorsese qua hàng loạt siêu phẩm kinh điển.',
    awards: [
      { id: 'awd-rdn-1', name: 'Oscar (Academy Awards)', category: 'Nam diễn viên chính xuất sắc nhất', year: 1981, movie_title: 'Raging Bull', status: 'won', source: 'AMPAS' },
      { id: 'awd-rdn-2', name: 'Oscar (Academy Awards)', category: 'Nam diễn viên phụ xuất sắc nhất', year: 1975, movie_title: 'The Godfather Part II', status: 'won', source: 'AMPAS' }
    ]
  },
  '287': { // Brad Pitt
    nationality: 'Mỹ 🇺🇸',
    acting_style: 'Thần thái tài tử quyến rũ, lối diễn ngông ngạo thông minh và đa phong cách.',
    total_box_office: '$5.1 Tỷ USD',
    highest_grossing_movie: 'World War Z ($540 Tr USD)',
    landmark_works: [
      'Fight Club (1999)',
      'Se7en (1995)',
      'Inglourious Basterds (2009)',
      'Once Upon a Time in Hollywood (2019)',
      'Ocean\'s Eleven (2001)'
    ],
    biography_vi: 'Brad Pitt là một trong những tài tử biểu tượng và nhà sản xuất phim quyền lực nhất Hollywood, từng đoạt giải Oscar cho vai diễn trong Once Upon a Time in Hollywood.',
    awards: [
      { id: 'awd-bp-1', name: 'Oscar (Academy Awards)', category: 'Nam diễn viên phụ xuất sắc nhất', year: 2020, movie_title: 'Once Upon a Time in Hollywood', status: 'won', source: 'AMPAS' },
      { id: 'awd-bp-2', name: 'Golden Globe Awards', category: 'Nam diễn viên phụ xuất sắc nhất', year: 1996, movie_title: '12 Monkeys', status: 'won', source: 'HFPA' }
    ]
  },
  '5292': { // Denzel Washington
    nationality: 'Mỹ 🇺🇸',
    acting_style: 'Phong thái uy nghi, chất giọng nội lực truyền cảm hứng và khả năng điều khiển nhịp phim xuất thần.',
    total_box_office: '$4.5 Tỷ USD',
    highest_grossing_movie: 'American Gangster ($266 Tr USD)',
    landmark_works: [
      'Training Day (2001)',
      'Malcolm X (1992)',
      'Glory (1989)',
      'Flight (2012)',
      'The Equalizer Series (2014-2023)'
    ],
    biography_vi: 'Denzel Washington là nam diễn viên da màu đầu tiên giành 2 giải Oscar diễn xuất, được mệnh danh là biểu tượng văn hóa đỉnh cao của Hollywood.',
    awards: [
      { id: 'awd-dw-1', name: 'Oscar (Academy Awards)', category: 'Nam diễn viên chính xuất sắc nhất', year: 2002, movie_title: 'Training Day', status: 'won', source: 'AMPAS' },
      { id: 'awd-dw-2', name: 'Oscar (Academy Awards)', category: 'Nam diễn viên phụ xuất sắc nhất', year: 1990, movie_title: 'Glory', status: 'won', source: 'AMPAS' }
    ]
  },
  '1136406': { // Tom Holland
    nationality: 'Anh 🇬🇧',
    acting_style: 'Năng nổ, giàu thể lực với khả năng thực hiện nhào lộn thực tế đỉnh cao kết hợp biểu cảm hài hước, chân thực và vô cùng gần gũi.',
    total_box_office: '$9.6 Tỷ USD',
    highest_grossing_movie: 'Spider-Man: No Way Home ($1.92 Tỷ USD)',
    landmark_works: [
      'Spider-Man: No Way Home (2021)',
      'The Impossible (2012)',
      'Uncharted (2022)',
      'Avengers: Endgame (2019)',
      'The Devil All the Time (2020)'
    ],
    biography_vi: 'Tom Holland là nam diễn viên hàng đầu người Anh, trở thành hiện tượng văn hóa toàn cầu khi đảm nhận vai diễn Người Nhện (Peter Parker / Spider-Man) trong Vũ trụ Điện ảnh Marvel (MCU). Anh ghi dấu ấn thực lực từ năm 16 tuổi qua tác phẩm thảm họa The Impossible và là diễn viên trẻ nhất đoạt giải BAFTA EE Rising Star năm 2017.',
    awards: [
      { id: 'awd-tholl-1', name: 'BAFTA Film Awards', category: 'Ngôi sao đang lên (EE Rising Star Award)', year: 2017, movie_title: 'Sự nghiệp & Spider-Man', status: 'won', source: 'BAFTA' },
      { id: 'awd-tholl-2', name: 'Saturn Awards', category: 'Nam diễn viên trẻ xuất sắc nhất', year: 2017, movie_title: 'Spider-Man: Homecoming', status: 'won', source: 'Academy of Science Fiction' },
      { id: 'awd-tholl-3', name: 'Saturn Awards', category: 'Nam diễn viên trẻ xuất sắc nhất', year: 2018, movie_title: 'Avengers: Infinity War', status: 'won', source: 'Academy of Science Fiction' },
      { id: 'awd-tholl-4', name: 'Saturn Awards', category: 'Nam diễn viên trẻ xuất sắc nhất', year: 2019, movie_title: 'Spider-Man: Far From Home', status: 'won', source: 'Academy of Science Fiction' },
      { id: 'awd-tholl-5', name: 'London Film Critics Circle', category: 'Nghệ sĩ trẻ Anh quốc của năm', year: 2013, movie_title: 'The Impossible', status: 'won', source: 'LFCC' },
      { id: 'awd-tholl-6', name: 'Empire Awards', category: 'Nam diễn viên mới xuất sắc nhất', year: 2013, movie_title: 'The Impossible', status: 'won', source: 'Empire' },
      { id: 'awd-tholl-7', name: 'National Board of Review', category: 'Diễn viên đột phá (Breakthrough Performance)', year: 2012, movie_title: 'The Impossible', status: 'won', source: 'NBR' },
      { id: 'awd-tholl-8', name: 'Teen Choice Awards', category: 'Nam diễn viên phim mùa hè xuất sắc nhất', year: 2017, movie_title: 'Spider-Man: Homecoming', status: 'won', source: 'Teen Choice' }
    ]
  }
};
