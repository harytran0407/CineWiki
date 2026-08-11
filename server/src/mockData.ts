import { Movie, Actor, Notification } from './types';

export const MOCK_MOVIES: Movie[] = [
  {
    id: 872585,
    title: "Oppenheimer",
    original_title: "Oppenheimer",
    title_vi: "Oppenheimer - Tội Lỗi Của Trí Tuệ",
    poster_path: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1200&auto=format&fit=crop&q=80",
    release_date: "2023-07-21",
    runtime: 180,
    genres: [
      { id: 18, name: "Drama" },
      { id: 36, name: "History" },
      { id: 878, name: "Sci-Fi" }
    ],
    director: "Christopher Nolan",
    writer: "Christopher Nolan (Dựa trên tiểu thuyết 'American Prometheus')",
    studio: "Universal Pictures",
    vote_average: 8.9,
    vote_count: 14200,
    imdb_score: 8.9,
    rotten_tomatoes: {
      tomatometer: 93,
      audience_score: 91
    },
    metacritic_score: 90,
    budget: "$100,000,000",
    box_office: "$957,000,000",
    overview: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.",
    overview_vi: "Tác phẩm điện ảnh tái hiện cuộc đời kiệt xuất và đầy giằng xé của nhà vật lý lý thuyết J. Robert Oppenheimer, người đứng đầu Dự án Manhattan khai sinh ra bom nguyên tử, thay đổi vĩnh viễn cục diện lịch sử nhân loại.",
    technical_highlights: {
      cinematography: "Quay phim IMAX 65mm thực tế bởi Hoyte van Hoytema",
      music: "Nhạc nền giao hưởng kịch tính sáng tác bởi Ludwig Göransson",
      vfx: "Kỹ xảo phản ứng hạt nhân hoàn toàn thực nghiệm (không dùng CGI)"
    },
    cast: [
      { id: 2038, name: "Cillian Murphy", character: "J. Robert Oppenheimer", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80" },
      { id: 3223, name: "Robert Downey Jr.", character: "Lewis Strauss", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80" },
      { id: 50544, name: "Emily Blunt", character: "Katherine Oppenheimer", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80" },
      { id: 1373737, name: "Florence Pugh", character: "Jean Tatlock", profile_path: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80" }
    ],
    awards: [
      { name: "Oscar (Academy Awards)", category: "Phim hay nhất & Đạo diễn xuất sắc nhất", year: 2024 },
      { name: "BAFTA Film Awards", category: "Phim xuất sắc nhất", year: 2024 },
      { name: "Golden Globe Awards", category: "Phim chính劇 hay nhất", year: 2024 }
    ],
    trailer_url: "https://www.youtube.com/embed/uYPbbksJxIg"
  },
  {
    id: 693134,
    title: "Dune: Part Two",
    original_title: "Dune: Part Two",
    title_vi: "Hành Tinh Cát: Phần Hai",
    poster_path: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80",
    release_date: "2024-03-01",
    runtime: 166,
    genres: [
      { id: 878, name: "Sci-Fi" },
      { id: 12, name: "Adventure" },
      { id: 18, name: "Drama" }
    ],
    director: "Denis Villeneuve",
    writer: "Denis Villeneuve & Jon Spaihts (Dựa trên tiểu thuyết của Frank Herbert)",
    studio: "Warner Bros. Pictures / Legendary",
    vote_average: 8.6,
    vote_count: 9800,
    imdb_score: 8.6,
    rotten_tomatoes: {
      tomatometer: 92,
      audience_score: 95
    },
    metacritic_score: 79,
    budget: "$190,000,000",
    box_office: "$711,800,000",
    overview: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
    overview_vi: "Hành trình huyền thoại của Paul Atreides khi hợp sức cùng Chani và tộc người Fremen để trả thù những kẻ đã tàn phá gia tộc mình, đồng thời đứng trước lựa chọn định mệnh giữa tình yêu và số phận vũ trụ.",
    technical_highlights: {
      cinematography: "Góc quay đại cảnh hoành tráng bởi Greig Fraser",
      music: "Âm hưởng giao hưởng viễn tưởng đỉnh cao của Hans Zimmer",
      vfx: "Thiết kế quái vật sâu cát và khí tài chiến tranh Arrakis vô cùng chân thực"
    },
    cast: [
      { id: 1190668, name: "Timothée Chalamet", character: "Paul Atreides", profile_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80" },
      { id: 505710, name: "Zendaya", character: "Chani", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80" },
      { id: 1373737, name: "Florence Pugh", character: "Princess Irulan", profile_path: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80" }
    ],
    trailer_url: "https://www.youtube.com/embed/Way9Dexny3w"
  },
  {
    id: 27205,
    title: "Inception",
    original_title: "Inception",
    title_vi: "Kẻ Đánh Cắp Giấc Mơ",
    poster_path: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80",
    release_date: "2010-07-16",
    runtime: 148,
    genres: [
      { id: 878, name: "Sci-Fi" },
      { id: 28, name: "Action" },
      { id: 12, name: "Adventure" }
    ],
    director: "Christopher Nolan",
    writer: "Christopher Nolan",
    studio: "Warner Bros. Pictures",
    vote_average: 8.8,
    vote_count: 35000,
    imdb_score: 8.8,
    rotten_tomatoes: {
      tomatometer: 87,
      audience_score: 91
    },
    metacritic_score: 74,
    budget: "$160,000,000",
    box_office: "$836,800,000",
    overview: "Cobb, a skilled thief who steals corporate secrets through dream-sharing technology, is given the inverse task of planting an idea into the mind of a C.E.O.",
    overview_vi: "Dom Cobb là một kẻ trộm bậc thầy chuyên thâm nhập vào tiềm thức để đánh cắp bí mật kinh doanh. Anh nhận nhiệm vụ cấy một ý tưởng vào tâm trí mục tiêu để đổi lấy cơ hội trở về nhà.",
    technical_highlights: {
      cinematography: "Quay phim không trọng lực thực tế tại hành lang xoay",
      music: "Bản nhạc biểu tượng 'Time' của Hans Zimmer"
    },
    cast: [
      { id: 6193, name: "Leonardo DiCaprio", character: "Dom Cobb", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80" },
      { id: 2038, name: "Cillian Murphy", character: "Robert Fischer", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80" }
    ],
    awards: [
      { name: "Oscar (Academy Awards)", category: "Quay phim xuất sắc nhất & Kỹ xảo xuất sắc nhất", year: 2011 }
    ],
    trailer_url: "https://www.youtube.com/embed/YoHD9XEInc0"
  }
];

export const MOCK_ACTORS: Actor[] = [
  {
    id: 2038,
    name: "Cillian Murphy",
    profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
    birthday: "1976-05-25",
    place_of_birth: "Douglas, Cork, Ireland",
    nationality: "Ireland 🇮🇪",
    height: "1.77 m",
    debut_year: 1996,
    known_for_department: "Acting",
    acting_style: "Phương pháp diễn xuất nội tâm sâu sắc, ánh mắt giàu cảm xúc thần thái và khả năng nhập vai đa dạng từ phản diện đến anh hùng.",
    total_box_office: "$2.8 Tỷ USD",
    highest_grossing_movie: "Oppenheimer ($957 Tr USD)",
    landmark_works: ["Oppenheimer (2023)", "Peaky Blinders (2013-2022)", "Inception (2010)", "The Dark Knight (2008)", "28 Days Later (2002)"],
    biography: "Cillian Murphy is an Irish actor known for his striking blue eyes, intense screen presence, and versatile performances across stage and film.",
    biography_vi: "Cillian Murphy là nam diễn viên hàng đầu người Ireland. Anh nổi tiếng toàn cầu với vai diễn Thomas Shelby trong loạt phim Peaky Blinders và vai diễn để đời J. Robert Oppenheimer trong siêu phẩm Oppenheimer của đạo diễn Christopher Nolan.",
    awards: [
      {
        id: "awd-1",
        name: "Oscar (Academy Awards)",
        category: "Nam diễn viên chính xuất sắc nhất",
        year: 2024,
        movie_title: "Oppenheimer",
        status: "won",
        source: "AMPAS"
      },
      {
        id: "awd-2",
        name: "BAFTA Film Awards",
        category: "Nam diễn viên chính xuất sắc nhất",
        year: 2024,
        movie_title: "Oppenheimer",
        status: "won",
        source: "BAFTA"
      },
      {
        id: "awd-3",
        name: "Golden Globe Awards",
        category: "Nam diễn viên chính xuất sắc nhất - Phim Drama",
        year: 2024,
        movie_title: "Oppenheimer",
        status: "won",
        source: "HFPA"
      }
    ],
    filmography: [
      { id: 872585, title: "Oppenheimer", year: 2023, character: "J. Robert Oppenheimer", vote_average: 8.9, poster_path: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300", genre: "Drama" },
      { id: 49026, title: "The Dark Knight Rises", year: 2012, character: "Dr. Jonathan Crane / Scarecrow", vote_average: 8.4, poster_path: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300", genre: "Action" },
      { id: 27205, title: "Inception", year: 2010, character: "Robert Fischer", vote_average: 8.8, poster_path: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300", genre: "Sci-Fi" },
      { id: 155, title: "The Dark Knight", year: 2008, character: "Dr. Jonathan Crane / Scarecrow", vote_average: 9.0, poster_path: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300", genre: "Action" },
      { id: 272, title: "Batman Begins", year: 2005, character: "Dr. Jonathan Crane / Scarecrow", vote_average: 8.2, poster_path: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300", genre: "Action" },
      { id: 170, title: "28 Days Later", year: 2002, character: "Jim", vote_average: 7.6, poster_path: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300", genre: "Horror" }
    ]
  },
  {
    id: 3223,
    name: "Robert Downey Jr.",
    profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80",
    birthday: "1965-04-04",
    place_of_birth: "New York City, New York, USA",
    nationality: "Mỹ 🇺🇸",
    height: "1.74 m",
    debut_year: 1970,
    known_for_department: "Acting",
    acting_style: "Lối diễn hài hước thông minh, lôi cuốn tự nhiên, thần thái tự tin nổi bật và khả năng ứng biến ngôn từ cực kỳ duyên dáng.",
    total_box_office: "$14.8 Tỷ USD",
    highest_grossing_movie: "Avengers: Endgame ($2.79 Tỷ USD)",
    landmark_works: ["Iron Man (2008)", "Avengers: Endgame (2019)", "Sherlock Holmes (2009)", "Oppenheimer (2023)", "Chaplin (1992)"],
    biography: "Robert Downey Jr. is an American actor and producer. His career has been characterized by critical and popular success in his youth, followed by a period of substance abuse and legal troubles, before a resurgence of commercial success in middle age.",
    biography_vi: "Robert Downey Jr. là nam diễn viên xuất sắc người Mỹ. Anh trở thành biểu tượng văn hóa đại chúng toàn cầu với vai diễn Iron Man (Tony Stark) trong Vũ trụ Điện ảnh Marvel và giải Oscar Nam phụ xuất sắc nhất trong Oppenheimer.",
    awards: [
      {
        id: "awd-rdj-1",
        name: "Oscar (Academy Awards)",
        category: "Nam diễn viên phụ xuất sắc nhất",
        year: 2024,
        movie_title: "Oppenheimer",
        status: "won",
        source: "AMPAS"
      },
      {
        id: "awd-rdj-2",
        name: "BAFTA Film Awards",
        category: "Nam diễn viên phụ xuất sắc nhất",
        year: 2024,
        movie_title: "Oppenheimer",
        status: "won",
        source: "BAFTA"
      },
      {
        id: "awd-rdj-3",
        name: "Golden Globe Awards",
        category: "Nam diễn viên phụ xuất sắc nhất",
        year: 2024,
        movie_title: "Oppenheimer",
        status: "won",
        source: "HFPA"
      }
    ],
    filmography: [
      { id: 872585, title: "Oppenheimer", year: 2023, character: "Lewis Strauss", vote_average: 8.9, poster_path: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300", genre: "Drama" },
      { id: 299534, title: "Avengers: Endgame", year: 2019, character: "Tony Stark / Iron Man", vote_average: 8.3, poster_path: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300", genre: "Action" },
      { id: 10528, title: "Sherlock Holmes", year: 2009, character: "Sherlock Holmes", vote_average: 7.6, poster_path: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300", genre: "Action" },
      { id: 1726, title: "Iron Man", year: 2008, character: "Tony Stark / Iron Man", vote_average: 7.9, poster_path: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300", genre: "Action" }
    ]
  },
  {
    id: 6193,
    name: "Leonardo DiCaprio",
    profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80",
    birthday: "1974-11-11",
    place_of_birth: "Los Angeles, California, USA",
    nationality: "Mỹ 🇺🇸",
    height: "1.83 m",
    debut_year: 1989,
    known_for_department: "Acting",
    acting_style: "Diễn xuất dấn thân cực hạn, chọn lọc kịch bản kỹ lưỡng chuyên làm việc với các đạo diễn đại tài (Scorsese, Nolan, Tarantino).",
    total_box_office: "$7.2 Tỷ USD",
    highest_grossing_movie: "Titanic ($2.26 Tỷ USD)",
    landmark_works: ["Titanic (1997)", "Inception (2010)", "The Revenant (2015)", "The Wolf of Wall Street (2013)", "Catch Me If You Can (2002)"],
    biography: "Leonardo Wilhelm DiCaprio is an American actor and film producer. Known for his work in biopics and period films, he has received numerous accolades, including an Academy Award, a British Academy Film Award, and three Golden Globe Awards.",
    biography_vi: "Leonardo DiCaprio là nam tài tử quyền lực bậc nhất Hollywood. Với hơn 3 thập kỷ cống hiến, anh đã đoạt giải Oscar Nam chính xuất sắc nhất với The Revenant và sở hữu gia tài điện ảnh đồ sộ toàn tác phẩm kinh điển.",
    awards: [
      {
        id: "awd-leo-1",
        name: "Oscar (Academy Awards)",
        category: "Nam diễn viên chính xuất sắc nhất",
        year: 2016,
        movie_title: "The Revenant",
        status: "won",
        source: "AMPAS"
      },
      {
        id: "awd-leo-2",
        name: "BAFTA Film Awards",
        category: "Nam diễn viên chính xuất sắc nhất",
        year: 2016,
        movie_title: "The Revenant",
        status: "won",
        source: "BAFTA"
      },
      {
        id: "awd-leo-3",
        name: "Golden Globe Awards",
        category: "Nam diễn viên chính xuất sắc nhất - Phim Drama",
        year: 2016,
        movie_title: "The Revenant",
        status: "won",
        source: "HFPA"
      }
    ],
    filmography: [
      { id: 27205, title: "Inception", year: 2010, character: "Dom Cobb", vote_average: 8.8, poster_path: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300", genre: "Sci-Fi" },
      { id: 597, title: "Titanic", year: 1997, character: "Jack Dawson", vote_average: 7.9, poster_path: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300", genre: "Drama" }
    ]
  },
  {
    id: 505710,
    name: "Zendaya",
    profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    birthday: "1996-09-01",
    place_of_birth: "Oakland, California, USA",
    nationality: "Mỹ 🇺🇸",
    height: "1.78 m",
    debut_year: 2010,
    known_for_department: "Acting",
    acting_style: "Biểu cảm chân thực, khả năng thể hiện nội tâm nhân vật trẻ tuổi sắc bén và cá tính thời trang nổi bật.",
    total_box_office: "$5.4 Tỷ USD",
    highest_grossing_movie: "Spider-Man: No Way Home ($1.92 Tỷ USD)",
    landmark_works: ["Dune: Part Two (2024)", "Euphoria (2019-nay)", "Spider-Man: No Way Home (2021)", "Challengers (2024)"],
    biography: "Zendaya Maree Stoermer Coleman is an American actress and singer. She has received various accolades, including two Primetime Emmy Awards and a Golden Globe Award.",
    biography_vi: "Zendaya là nữ minh tinh thế hệ mới hàng đầu Hollywood. Cô từng 2 lần thắng giải Emmy cho vai diễn trong Euphoria và thủ vai nữ chính Chani trong bom tấn Dune.",
    awards: [
      {
        id: "awd-zen-1",
        name: "Primetime Emmy Awards",
        category: "Nữ diễn viên chính xuất sắc nhất - Phim Drama",
        year: 2022,
        movie_title: "Euphoria",
        status: "won",
        source: "Television Academy"
      },
      {
        id: "awd-zen-2",
        name: "Golden Globe Awards",
        category: "Nữ diễn viên chính xuất sắc nhất - Phim Truyền hình Drama",
        year: 2023,
        movie_title: "Euphoria",
        status: "won",
        source: "HFPA"
      }
    ],
    filmography: [
      { id: 693134, title: "Dune: Part Two", year: 2024, character: "Chani", vote_average: 8.6, poster_path: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300", genre: "Sci-Fi" },
      { id: 634649, title: "Spider-Man: No Way Home", year: 2021, character: "MJ", vote_average: 8.0, poster_path: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300", genre: "Action" }
    ]
  },
  {
    id: 31,
    name: "Tom Hanks",
    profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
    birthday: "1956-07-09",
    place_of_birth: "Concord, California, USA",
    nationality: "Mỹ 🇺🇸",
    height: "1.83 m",
    debut_year: 1980,
    known_for_department: "Acting",
    acting_style: "Khả năng hóa thân xuất sắc vào các nhân vật biểu tượng mang đậm tính nhân văn, lối diễn tự nhiên, chân thực và đầy cảm xúc chạm tới trái tim người xem.",
    total_box_office: "$9.9 Tỷ USD",
    highest_grossing_movie: "Toy Story 4 ($1.07 Tỷ USD)",
    landmark_works: [
      "Forrest Gump (1994)",
      "Saving Private Ryan (1998)",
      "Cast Away (2000)",
      "Philadelphia (1993)",
      "The Green Mile (1999)",
      "Toy Story Series (1995-2019)"
    ],
    biography: "Thomas Jeffrey Hanks is an American actor and filmmaker. Known for both his comedic and dramatic roles, he is one of the most popular and recognizable film stars worldwide.",
    biography_vi: "Tom Hanks là một trong những huyền thoại điện ảnh vĩ đại nhất lịch sử Hollywood. Ông là một trong hai nam diễn viên duy nhất trong lịch sử từng giành 2 giải Oscar Nam chính xuất sắc nhất trong 2 năm liên tiếp (1994 với Philadelphia và 1995 với Forrest Gump). Với sự nghiệp trải dài hơn 4 thập kỷ, Tom Hanks được mệnh danh là 'Người cha ruột của điện ảnh Mỹ'.",
    awards: [
      {
        id: "awd-th-1",
        name: "Oscar (Academy Awards)",
        category: "Nam diễn viên chính xuất sắc nhất",
        year: 1995,
        movie_title: "Forrest Gump",
        status: "won",
        source: "AMPAS"
      },
      {
        id: "awd-th-2",
        name: "Oscar (Academy Awards)",
        category: "Nam diễn viên chính xuất sắc nhất",
        year: 1994,
        movie_title: "Philadelphia",
        status: "won",
        source: "AMPAS"
      },
      {
        id: "awd-th-3",
        name: "Golden Globe Awards",
        category: "Nam diễn viên chính xuất sắc nhất - Phim Drama",
        year: 2001,
        movie_title: "Cast Away",
        status: "won",
        source: "HFPA"
      },
      {
        id: "awd-th-4",
        name: "Golden Globe Awards",
        category: "Nam diễn viên chính xuất sắc nhất - Phim Drama",
        year: 1995,
        movie_title: "Forrest Gump",
        status: "won",
        source: "HFPA"
      },
      {
        id: "awd-th-5",
        name: "Golden Globe Awards",
        category: "Nam diễn viên chính xuất sắc nhất - Phim Drama",
        year: 1994,
        movie_title: "Philadelphia",
        status: "won",
        source: "HFPA"
      },
      {
        id: "awd-th-6",
        name: "BAFTA Film Awards",
        category: "Nam diễn viên chính xuất sắc nhất",
        year: 1995,
        movie_title: "Forrest Gump",
        status: "won",
        source: "BAFTA"
      }
    ],
    filmography: [
      { id: 13, title: "Forrest Gump", year: 1994, character: "Forrest Gump", vote_average: 8.8, poster_path: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300", genre: "Drama" },
      { id: 857, title: "Saving Private Ryan", year: 1998, character: "Captain Miller", vote_average: 8.6, poster_path: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300", genre: "War" },
      { id: 8358, title: "Cast Away", year: 2000, character: "Chuck Noland", vote_average: 7.7, poster_path: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300", genre: "Drama" },
      { id: 497, title: "The Green Mile", year: 1999, character: "Paul Edgecomb", vote_average: 8.6, poster_path: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300", genre: "Drama" },
      { id: 9800, title: "Philadelphia", year: 1993, character: "Andrew Beckett", vote_average: 7.7, poster_path: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300", genre: "Drama" },
      { id: 862, title: "Toy Story", year: 1995, character: "Woody (voice)", vote_average: 8.0, poster_path: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300", genre: "Adventure" }
    ]
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-1",
    actor_id: 2038,
    actor_name: "Cillian Murphy",
    actor_profile: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    title: "Cập nhật dự án mới",
    message: "Cillian Murphy chính thức tham gia dự án phim mới của đài BBC.",
    created_at: "2 giờ trước",
    is_read: false,
    type: "movie"
  }
];

export const INITIAL_NOTIFICATIONS = MOCK_NOTIFICATIONS;
