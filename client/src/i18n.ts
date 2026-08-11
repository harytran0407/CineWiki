import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  vi: {
    translation: {
      nav: {
        home: "Trang chủ",
        movies: "Phim ảnh",
        actors: "Diễn viên",
        compare: "So sánh diễn viên",
        network: "Mạng lưới liên kết",
        search: "Lọc nâng cao",
        idols: "Idol của tôi",
        searchPlaceholder: "Tìm kiếm phim hoặc diễn viên..."
      },
      hero: {
        badge: "Nền tảng tra cứu điện ảnh thế hệ mới",
        title: "Khám phá vũ trụ Phim & Diễn viên",
        subtitle: "Trực quan hóa sự nghiệp diễn viên, so sánh đối đầu và khám phá mạng lưới kết nối phim ảnh độc đáo.",
        exploreBtn: "Khám phá ngay",
        networkBtn: "Mạng lưới 6 độ"
      },
      home: {
        trendingMovies: "Phim Thịnh Hành",
        featuredActors: "Diễn Viên Nổi Bật",
        quickFilter: "Thể loại phổ biến",
        viewAll: "Xem tất cả",
        follow: "Theo dõi",
        following: "Đã theo dõi"
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
        biography: "Tiểu sử chi tiết",
        birthday: "Ngày sinh",
        birthplace: "Nơi sinh",
        department: "Lĩnh vực",
        followBtn: "Theo dõi Idol",
        unfollowBtn: "Đã theo dõi",
        careerTimeline: "Timeline Sự Nghiệp Trực Quan",
        colorByGenre: "Tô màu theo Thể loại",
        colorByRating: "Tô màu theo Điểm số",
        upcomingProjects: "Dự án & Phim Sắp Ra Mắt",
        awards: "Giải thưởng & Danh hiệu Cao quý",
        filmography: "Toàn bộ Filmography",
        daysToBirthday: "còn {{days}} ngày đến sinh nhật!",
        nextMovieCountdown: "Phim tiếp theo ra mắt sau {{days}} ngày"
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
        genre: "Thể loại",
        yearRange: "Khoảng năm phát hành",
        minRating: "Điểm đánh giá tối thiểu",
        sortBy: "Sắp xếp theo",
        sortRating: "Điểm đánh giá cao nhất",
        sortDate: "Mới nhất",
        sortPopularity: "Độ phổ biến",
        resultsFound: "Tìm thấy {{count}} kết quả phù hợp"
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
        actors: "Actors",
        compare: "Compare Actors",
        network: "Actor Network",
        search: "Advanced Filter",
        idols: "My Idols",
        searchPlaceholder: "Search movies or actors..."
      },
      hero: {
        badge: "Next-Gen Movie & Actor Encyclopedia",
        title: "Discover the Universe of Movies & Actors",
        subtitle: "Visualize career timelines, side-by-side actor stats, and six degrees of separation network maps.",
        exploreBtn: "Explore Now",
        networkBtn: "Network Map"
      },
      home: {
        trendingMovies: "Trending Movies",
        featuredActors: "Featured Actors",
        quickFilter: "Popular Genres",
        viewAll: "View All",
        follow: "Follow",
        following: "Following"
      },
      movie: {
        director: "Director",
        releaseDate: "Release Date",
        runtime: "Runtime",
        rating: "Rating Score",
        overview: "Synopsis",
        cast: "Top Cast",
        similar: "Similar Movies",
        watchTrailer: "Watch Trailer",
        aiTranslate: "Read in English",
        aiTranslating: "Translating...",
        minutes: "mins"
      },
      actor: {
        biography: "Biography",
        birthday: "Birthday",
        birthplace: "Place of Birth",
        department: "Department",
        followBtn: "Follow Idol",
        unfollowBtn: "Following",
        careerTimeline: "Career Timeline Visualization",
        colorByGenre: "Color by Genre",
        colorByRating: "Color by Rating",
        upcomingProjects: "Upcoming Projects & Releases",
        awards: "Awards & Recognition",
        filmography: "Full Filmography",
        daysToBirthday: "{{days}} days left until birthday!",
        nextMovieCountdown: "Next movie releases in {{days}} days"
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
        genre: "Genre",
        yearRange: "Release Year Range",
        minRating: "Minimum Rating Score",
        sortBy: "Sort By",
        sortRating: "Highest Rating",
        sortDate: "Release Date",
        sortPopularity: "Popularity",
        resultsFound: "Found {{count}} matching results"
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
