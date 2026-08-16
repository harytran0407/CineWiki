import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  vi: {
    translation: {
      nav: {
        home: "Trang chủ",
        movies: "Phim ảnh",
        actors: "Celebs",
        compare: "So sánh đối đầu",
        network: "Mạng lưới liên kết",
        search: "Lọc nâng cao",
        idols: "Idol của tôi",
        searchPlaceholder: "Tìm kiếm phim hoặc diễn viên...",
        genres: "Thể loại",
        countries: "Quốc gia",
        random: "Ngẫu nhiên",
        login: "Đăng nhập",
        logout: "Đăng xuất"
      },
      hero: {
        badge: "Nền tảng tra cứu điện ảnh thế hệ mới",
        title: "Khám phá vũ trụ Phim & Diễn viên",
        subtitle: "Trực quan hóa sự nghiệp diễn viên, so sánh đối đầu và khám phá mạng lưới kết nối phim ảnh độc đáo.",
        exploreBtn: "Khám phá ngay",
        networkBtn: "Mạng lưới 6 độ"
      },
      home: {
        title: "CineWiki - Khám Phá Điện Ảnh Thế Giới",
        subtitle: "Khám phá kho tàng điện ảnh thế giới với thông tin chi tiết về phim, diễn viên và đạo diễn hàng đầu.",
        watchFeatured: "Xem Phim Nổi Bật",
        compareMovies: "So Sánh Phim",
        compareActors: "So Sánh Diễn Viên",
        trendingMovies: "Phim Đang Thịnh Hành",
        trendingSub: "Các tác phẩm có lượng xem và quan tâm cao nhất thế giới",
        upcomingMovies: "Phim Sắp Khởi Chiếu",
        upcomingSub: "Các siêu bom tấn sắp khởi chiếu",
        releasing: "Khởi chiếu: {{date}}",
        featuredActors: "Diễn Viên Nổi Bật",
        actorsSub: "Các diễn viên hàng đầu đang dẫn dắt phòng vé toàn cầu",
        quickFilter: "Thể loại phổ biến",
        viewAll: "Xem thêm",
        follow: "Theo dõi",
        following: "Đã theo dõi",
        prevPage: "Trang trước",
        nextPage: "Trang sau",
        pageOf: "Trang {{current}} / {{total}}"
      },
      movie: {
        director: "Đạo diễn",
        releaseDate: "Ngày phát hành",
        runtime: "Thời lượng",
        rating: "Điểm đánh giá",
        overview: "Nội dung phim",
        cast: "Dàn diễn viên chính",
        similar: "Phim tương tự",
        watchTrailer: "Xem Trailer",
        aiTranslate: "Chuyển ngữ Tiếng Việt",
        aiTranslating: "Đang chuyển ngữ...",
        minutes: "phút"
      },
      actor: {
        biography: "Tiểu sử và cuộc đời",
        birthYear: "Năm sinh",
        deathday: "Ngày mất",
        deceasedAge: "hưởng thọ {{age}} tuổi",
        birthplace: "Quốc gia",
        nationality: "Quốc gia",
        height: "Chiều cao",
        totalMovies: "Số bộ phim",
        activeYears: "Thời gian hoạt động",
        activeSpanDeceased: "{{from}} - {{to}} ({{years}} năm)",
        activeSpanAlive: "{{from}} - nay ({{years}} năm)",
        yearsLabel: "năm",
        worksCount: "tác phẩm",
        totalBoxOffice: "Doanh thu đạt được",
        careerTimeline: "Dòng Thời Gian Sự Nghiệp",
        landmarkWorks: "Tác phẩm Nổi bật",
        moviesInCareer: "phim trong sự nghiệp",
        scrollLeft: "Cuộn sang trái",
        scrollRight: "Cuộn sang phải",
        byRating: "Theo Rating",
        byGenre: "Theo Thể loại",
        colorLegend: "Chú thích màu:",
        ratingExcellent: "Xuất sắc (≥ 8.0)",
        ratingGood: "Tốt (7.0 - 7.9)",
        ratingAverage: "Trung bình (< 7.0)",
        role: "Vai",
        unknownRole: "Chưa có dữ liệu",
        upcoming: "Upcoming",
        viewMovieDetails: "Xem Chi Tiết Phim"
      },
      compare: {
        title: "So sánh Diễn viên Đối đầu",
        subtitle: "Phân tích chiều sâu phim chung, xu hướng điểm số và cơ cấu thể loại sự nghiệp giữa 2 diễn viên.",
        selectActorA: "Chọn hoặc tìm kiếm Diễn viên A",
        selectActorB: "Chọn hoặc tìm kiếm Diễn viên B",
        sharedMovies: "Phim đóng chung",
        noSharedMovies: "Chưa có phim đóng chung nào được ghi nhận",
        avgRating: "Điểm rating trung bình",
        totalMovies: "Tổng số phim đã đóng",
        genreDistribution: "Phân bố theo Thể loại",
        eraProgress: "Sự nghiệp qua các Thập niên"
      },
      network: {
        title: "Bản đồ Mạng lưới Diễn viên",
        subtitle: "Khám phá mối liên kết đóng chung phim theo nguyên lý 6 độ tách biệt (Six Degrees of Separation).",
        clickNodeHint: "Click vào node diễn viên để nhảy sang xem chi tiết hoặc khám phá bạn diễn chung.",
        centerActor: "Gốc mạng lưới",
        sharedMovieWith: "Đã đóng chung {{count}} phim với {{name}}"
      },
      search: {
        title: "Tìm kiếm & Lọc Nâng cao",
        subtitle: "Tìm kiếm bộ phim yêu thích theo thể loại, năm phát hành, điểm rating và sắp xếp linh hoạt.",
        keywordPlaceholder: "Gõ tên phim tìm kiếm (ví dụ: Mai, Oppenheimer, Avatar, Bố Già...)",
        searchBtn: "Tìm kiếm",
        resetBtn: "Xóa bộ lọc",
        genre: "Thể loại",
        country: "Quốc gia",
        releaseYear: "Năm phát hành",
        fromYear: "{{year}}",
        toYear: "- {{year}}",
        minRating: "Rating tối thiểu",
        sortBy: "Sắp xếp theo",
        sortPopularity: "Độ phổ biến",
        sortRating: "Điểm IMDb cao nhất",
        sortDate: "Năm phát hành mới nhất",
        allGenres: "Tất cả thể loại",
        allCountries: "Tất cả quốc gia",
        resultsFound: "Tìm thấy {{count}} kết quả phù hợp",
        noResultsTitle: "Không tìm thấy phim phù hợp",
        noResultsDesc: "Thử nới lỏng bộ lọc năm phát hành, thể loại hoặc điểm đánh giá tối thiểu.",
        resetSearchBtn: "Đặt lại tìm kiếm"
      },
      idols: {
        title: "Idol của tôi (Cá nhân hóa)",
        subtitle: "Bản tin tổng hợp mọi cập nhật phim mới, đếm ngược sự kiện và giải thưởng của dàn idol bạn theo dõi.",
        loginRequired: "Vui lòng đăng nhập để quản lý danh sách idol theo dõi của bạn.",
        loginBtn: "Đăng nhập ngay",
        followedCount: "Đang theo dõi {{count}} diễn viên",
        upcomingReleases: "Phim sắp chiếu đếm ngược",
        feedTitle: "Dòng thời gian cập nhật idol",
        noFollows: "Bạn chưa theo dõi diễn viên nào. Hãy khám phá và nhấn theo dõi để nhận thông báo!"
      },
      notif: {
        title: "Thông báo Idol",
        markAllRead: "Đánh dấu đã đọc tất cả",
        noNotifications: "Không có thông báo mới",
        newMovie: "Phim mới công bố",
        award: "Giải thưởng mới",
        birthday: "Sinh nhật sắp đến"
      },
      auth: {
        login: "Đăng nhập",
        register: "Đăng ký",
        email: "Email",
        password: "Mật khẩu",
        fullName: "Họ và tên",
        demoLogin: "Đăng nhập Nhanh (Demo)",
        welcomeBack: "Chào mừng bạn trở lại CineWiki!"
      }
    }
  },
  en: {
    translation: {
      nav: {
        home: "Home",
        movies: "Movies",
        actors: "Celebs",
        compare: "Compare",
        network: "Actor Network",
        search: "Advanced Filter",
        idols: "My Idols",
        searchPlaceholder: "Search movies or actors...",
        genres: "Genres",
        countries: "Countries",
        random: "Random",
        login: "Log In",
        logout: "Log Out"
      },
      hero: {
        badge: "Next-Gen Movie & Actor Encyclopedia",
        title: "Discover the Universe of Movies & Actors",
        subtitle: "Visualize career timelines, side-by-side actor stats, and six degrees of separation network maps.",
        exploreBtn: "Explore Now",
        networkBtn: "Network Map"
      },
      home: {
        title: "CineWiki - Discover World Cinema",
        subtitle: "Explore world cinema with comprehensive details on top movies, actors, and directors.",
        watchFeatured: "Watch Featured Movie",
        compareMovies: "Compare Movies",
        compareActors: "Compare Actors",
        trendingMovies: "Trending Movies",
        trendingSub: "Top trending and most popular movies worldwide",
        upcomingMovies: "Upcoming Releases",
        upcomingSub: "Upcoming blockbuster movies hitting theaters soon",
        releasing: "Releasing: {{date}}",
        featuredActors: "Featured Actors",
        actorsSub: "Top leading actors driving global box office successes",
        quickFilter: "Popular Genres",
        viewAll: "View All",
        follow: "Follow",
        following: "Following",
        prevPage: "Previous",
        nextPage: "Next",
        pageOf: "Page {{current}} / {{total}}"
      },
      movie: {
        director: "Director",
        releaseDate: "Release Date",
        runtime: "Runtime",
        rating: "Rating",
        overview: "Overview",
        cast: "Main Cast",
        similar: "Similar Movies",
        watchTrailer: "Watch Trailer",
        aiTranslate: "Translate to Vietnamese",
        aiTranslating: "Translating...",
        minutes: "mins"
      },
      actor: {
        biography: "Biography & Life",
        birthYear: "Date of Birth",
        deathday: "Date of Death",
        deceasedAge: "aged {{age}}",
        birthplace: "Nationality / Country",
        nationality: "Nationality",
        height: "Height",
        totalMovies: "Total Movies",
        activeYears: "Active Career",
        activeSpanDeceased: "{{from}} — {{to}} ({{years}} years)",
        activeSpanAlive: "{{from}} — present ({{years}} years)",
        yearsLabel: "years",
        worksCount: "movies",
        totalBoxOffice: "Total Box Office",
        careerTimeline: "Career Timeline",
        landmarkWorks: "Landmark Works",
        moviesInCareer: "movies in career",
        scrollLeft: "Scroll left",
        scrollRight: "Scroll right",
        byRating: "By Rating",
        byGenre: "By Genre",
        colorLegend: "Color Legend:",
        ratingExcellent: "Excellent (≥ 8.0)",
        ratingGood: "Good (7.0 - 7.9)",
        ratingAverage: "Average (< 7.0)",
        role: "Role",
        unknownRole: "Unknown",
        upcoming: "Upcoming",
        viewMovieDetails: "View Movie Details"
      },
      compare: {
        title: "Actor Head-to-Head Comparison",
        subtitle: "Analyze shared filmography, average scores, and genre career distributions between two stars.",
        selectActorA: "Search or Select Actor A",
        selectActorB: "Search or Select Actor B",
        sharedMovies: "Shared Movies",
        noSharedMovies: "No shared movies recorded between these actors",
        avgRating: "Average Rating Score",
        totalMovies: "Total Movies Acted",
        genreDistribution: "Genre Breakdown",
        eraProgress: "Career Progression by Era"
      },
      network: {
        title: "Actor Connection Map",
        subtitle: "Explore shared movie relationships based on the 6 degrees of separation concept.",
        clickNodeHint: "Click any actor node to view details or expand co-star connections.",
        centerActor: "Network Origin",
        sharedMovieWith: "Co-starred in {{count}} movies with {{name}}"
      },
      search: {
        title: "Advanced Search & Filter",
        subtitle: "Find movies by genre, release year, rating score and flexible sorting.",
        keywordPlaceholder: "Search movie title (e.g., Mai, Oppenheimer, Avatar...)",
        searchBtn: "Search",
        resetBtn: "Clear Filters",
        genre: "Genre",
        country: "Country",
        releaseYear: "Release Year",
        fromYear: "From {{year}}",
        toYear: "To {{year}}",
        minRating: "Minimum Rating",
        sortBy: "Sort By",
        sortPopularity: "Popularity",
        sortRating: "Highest Rating",
        sortDate: "Release Date",
        allGenres: "All Genres",
        allCountries: "All Countries",
        resultsFound: "Found {{count}} matching results",
        noResultsTitle: "No matching movies found",
        noResultsDesc: "Try relaxing year range, genre, or minimum rating filters.",
        resetSearchBtn: "Reset Search"
      },
      idols: {
        title: "My Idols Feed (Personalized)",
        subtitle: "Aggregated timeline feed for new movie announcements, event countdowns, and award alerts.",
        loginRequired: "Please log in to manage your followed idols list.",
        loginBtn: "Log In Now",
        followedCount: "Following {{count}} actors",
        upcomingReleases: "Upcoming Release Countdowns",
        feedTitle: "Idol Updates Timeline",
        noFollows: "You are not following any actors yet. Explore and hit follow to receive notifications!"
      },
      notif: {
        title: "Idol Notifications",
        markAllRead: "Mark all as read",
        noNotifications: "No new notifications",
        newMovie: "New Movie Announced",
        award: "New Award Won",
        birthday: "Birthday Coming Up"
      },
      auth: {
        login: "Log In",
        register: "Register",
        email: "Email Address",
        password: "Password",
        fullName: "Full Name",
        demoLogin: "Quick Login (Demo)",
        welcomeBack: "Welcome back to CineWiki!"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
