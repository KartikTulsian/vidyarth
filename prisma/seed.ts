// prisma/seed.ts

import { PrismaClient, OfferType, TradeStatus, ReminderType, ReviewType, ItemCondition, StuffType, BookType, StationeryType, UrgencyLevel, RequestStatus, TransactionStatus, NotificationType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Vidyarth Seed...");

  // Clear existing data (in development only)
  if (process.env.NODE_ENV === 'development') {
    console.log("🧹 Cleaning existing data...");
    await prisma.searchAnalytics.deleteMany();
    // await prisma.transaction.deleteMany();
    await prisma.reminder.deleteMany();
    await prisma.activity.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.message.deleteMany();
    await prisma.review.deleteMany();
    await prisma.trade.deleteMany();
    await prisma.offer.deleteMany();
    await prisma.request.deleteMany();
    await prisma.stuffFavorite.deleteMany();
    await prisma.stuffTag.deleteMany();
    await prisma.stuffImage.deleteMany();
    await prisma.stuff.deleteMany();
    await prisma.tag.deleteMany();
    // await prisma.safeDetails.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.schoolCollege.deleteMany();
    await prisma.user.deleteMany();
    await prisma.systemSettings.deleteMany();
  }

  // Create System Settings
  console.log("⚙️ Creating system settings...");
  await prisma.systemSettings.createMany({
    data: [
      {
        key: "platform_name",
        value: "Vidyarth",
        description: "Platform name"
      },
      {
        key: "max_rental_days", 
        value: "30",
        description: "Maximum rental period in days"
      },
      {
        key: "default_search_radius",
        value: "10", 
        description: "Default search radius in kilometers"
      },
      {
        key: "min_trust_score",
        value: "50",
        description: "Minimum trust score required for trading"
      }
    ]
  });

  // Create Schools and Colleges
  console.log("🏫 Creating schools and colleges...");
  const schoolsColleges = await Promise.all([
    prisma.schoolCollege.create({
      data: {
        name: "IEM Kolkata",
        type: "COLLEGE",
        location: "New Town, Kolkata",
        city: "Kolkata",
        state: "West Bengal", 
        pincode: "700156",
        latitude: 22.5726,
        longitude: 88.4639,
        is_verified: true
      }
    }),
    prisma.schoolCollege.create({
      data: {
        name: "UEM Kolkata",
        type: "UNIVERSITY",
        location: "New Town, Kolkata", 
        city: "Kolkata",
        state: "West Bengal",
        pincode: "700160",
        latitude: 22.5726,
        longitude: 88.4639,
        is_verified: true
      }
    }),
    prisma.schoolCollege.create({
      data: {
        name: "Jadavpur University",
        type: "UNIVERSITY",
        location: "Jadavpur",
        city: "Kolkata", 
        state: "West Bengal",
        pincode: "700032",
        latitude: 22.4987,
        longitude: 88.3719,
        is_verified: true
      }
    }),
    prisma.schoolCollege.create({
      data: {
        name: "St. Xavier's College",
        type: "COLLEGE",
        location: "Park Street",
        city: "Kolkata",
        state: "West Bengal", 
        pincode: "700016",
        latitude: 22.5516,
        longitude: 88.3531,
        is_verified: true
      }
    }),
    prisma.schoolCollege.create({
      data: {
        name: "South Point High School",
        type: "SCHOOL",
        location: "Santoshpur",
        city: "Kolkata",
        state: "West Bengal",
        pincode: "700094", 
        latitude: 22.5354,
        longitude: 88.3642,
        is_verified: true
      }
    })
  ]);

  // Create Tags
  console.log("🏷️ Creating tags...");
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: "Physics", description: "Physics related materials" } }),
    prisma.tag.create({ data: { name: "Chemistry", description: "Chemistry related materials" } }),
    prisma.tag.create({ data: { name: "Mathematics", description: "Mathematics related materials" } }),
    prisma.tag.create({ data: { name: "Biology", description: "Biology related materials" } }),
    prisma.tag.create({ data: { name: "Computer Science", description: "Computer Science materials" } }),
    prisma.tag.create({ data: { name: "Engineering", description: "Engineering related materials" } }),
    prisma.tag.create({ data: { name: "Literature", description: "Literature and Language materials" } }),
    prisma.tag.create({ data: { name: "History", description: "History related materials" } }),
    prisma.tag.create({ data: { name: "Economics", description: "Economics related materials" } }),
    prisma.tag.create({ data: { name: "Art", description: "Art and Design materials" } }),
    prisma.tag.create({ data: { name: "Stationery", description: "Writing and drawing supplies" } }),
    prisma.tag.create({ data: { name: "Electronics", description: "Electronic gadgets and devices" } })
  ]);

  // Create Users with Profiles
  console.log("👥 Creating users...");
  const users = [];
  
  for (let i = 1; i <= 10; i++) {
    const user = await prisma.user.create({
      data: {
        email: `user${i}@vidyarth.com`,
        username: `student_${i}`,
        clerk_id: `clerk_user_${i}`,
        is_active: true,
        profile: {
          create: {
            full_name: `Student User ${i}`,
            display_name: `User${i}`,
            gender: i % 2 === 0 ? "Male" : "Female",
            phone: `+91-987654${String(i).padStart(4, '0')}`,
            school_college_id: schoolsColleges[i % schoolsColleges.length].school_college_id,
            class_year: `${(i % 4) + 1}st Year`,
            course: i % 2 === 0 ? "B.Tech Computer Science" : "B.A. English",
            department: i % 2 === 0 ? "Computer Science" : "English",
            address: `Address ${i}, Kolkata`,
            city: "Kolkata",
            state: "West Bengal",
            pincode: `70001${i % 10}`,
            country: "India",
            latitude: 22.5726 + (i * 0.001),
            longitude: 88.4639 + (i * 0.001),
            bio: `Hello! I'm student ${i}, passionate about learning and sharing.`,
            is_verified: i <= 7,
            show_phone: i % 3 === 0,
            trust_score: Math.floor(Math.random() * 50) + 50,
            rating_average: Math.random() * 2 + 3, // 3.0 to 5.0
            total_ratings: Math.floor(Math.random() * 20) + 1
          }
        }
      },
      include: {
        profile: true
      }
    });
    users.push(user);
  }

  // Create Safe Details for some profiles
  // console.log("🔐 Creating safe details...");
  // for (let i = 0; i < 5; i++) {
  //   await prisma.safeDetails.create({
  //     data: {
  //       profile_id: users[i].profile?.profile_id,
  //       contact_name: users[i].profile?.full_name,
  //       contact_email: users[i].email,
  //       contact_phone: users[i].profile?.phone,
  //       pickup_address: `Safe Pickup Location ${i + 1}, Kolkata`,
  //       landmark: `Near Metro Station ${i + 1}`,
  //       latitude: 22.5726 + (i * 0.002),
  //       longitude: 88.4639 + (i * 0.002),
  //       pickup_instructions: "Please call before coming. Available on weekdays 9 AM - 6 PM.",
  //       available_timings: "Mon-Fri: 9 AM - 6 PM, Sat: 10 AM - 4 PM"
  //     }
  //   });
  // }

  // Create Stuff Items
  console.log("📚 Creating stuff items...");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stuffItems: any[] = [];

  // Books
  const bookTitles = [
    { title: "Introduction to Algorithms", author: "Thomas H. Cormen", subject: "Computer Science", book_type: BookType.TEXTBOOK },
    { title: "Physics for Engineers", author: "R.K. Gaur", subject: "Physics", book_type: BookType.TEXTBOOK },
    { title: "Organic Chemistry", author: "Morrison & Boyd", subject: "Chemistry", book_type: BookType.REFERENCE },
    { title: "Calculus: Early Transcendentals", author: "James Stewart", subject: "Mathematics", book_type: BookType.TEXTBOOK },
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", subject: "Literature", book_type: BookType.NOVEL },
    { title: "Database Systems", author: "Ramez Elmasri", subject: "Computer Science", book_type: BookType.TEXTBOOK },
    { title: "Principles of Economics", author: "N. Gregory Mankiw", subject: "Economics", book_type: BookType.TEXTBOOK },
    { title: "Engineering Mechanics", author: "Beer & Johnston", subject: "Engineering", book_type: BookType.TEXTBOOK }
  ];

  for (let i = 0; i < bookTitles.length; i++) {
    const book = bookTitles[i];
    const stuff = await prisma.stuff.create({
      data: {
        owner_id: users[i % users.length].user_id,
        type: StuffType.BOOK,
        title: book.title,
        author: book.author,
        subject: book.subject,
        book_type: book.book_type,
        description: `A comprehensive ${book.subject.toLowerCase()} book perfect for students.`,
        edition: `${Math.floor(Math.random() * 5) + 1}th Edition`,
        publication_year: 2018 + (i % 5),
        language: "English",
        class_suitability: `${Math.floor(Math.random() * 4) + 1}st Year`,
        condition: Object.values(ItemCondition)[i % Object.values(ItemCondition).length],
        original_price: 500 + (i * 100),
        is_available: true,
        quantity: 1,
        views_count: Math.floor(Math.random() * 50),
        favorites_count: Math.floor(Math.random() * 10)
      }
    });
    stuffItems.push(stuff);
  }

  // Stationery Items
  const stationeryItems = [
    { title: "Scientific Calculator Casio FX-991EX", brand: "Casio", type: StationeryType.CALCULATION },
    { title: "Drawing Set - Compass, Ruler, Protractor", brand: "Camlin", type: StationeryType.DRAWING },
    { title: "Premium Fountain Pen Set", brand: "Parker", type: StationeryType.WRITING },
    { title: "A4 Storage Box with Dividers", brand: "Solo", type: StationeryType.STORAGE }
  ];

  for (let i = 0; i < stationeryItems.length; i++) {
    const item = stationeryItems[i];
    const stuff = await prisma.stuff.create({
      data: {
        owner_id: users[i % users.length].user_id,
        type: StuffType.STATIONERY,
        title: item.title,
        brand: item.brand,
        stationery_type: item.type,
        description: `High quality ${item.title.toLowerCase()} in excellent condition.`,
        language: "English",
        condition: Object.values(ItemCondition)[i % Object.values(ItemCondition).length],
        original_price: 200 + (i * 50),
        is_available: true,
        quantity: 1,
        views_count: Math.floor(Math.random() * 30),
        favorites_count: Math.floor(Math.random() * 5)
      }
    });
    stuffItems.push(stuff);
  }

  // Create Stuff Images
  console.log("🖼️ Creating stuff images...");
  for (let i = 0; i < stuffItems.length; i++) {
    await prisma.stuffImage.create({
      data: {
        stuff_id: stuffItems[i].stuff_id,
        url: `https://example.com/images/stuff_${i + 1}.jpg`,
        alt_text: `Image of ${stuffItems[i].title}`,
        is_primary: true
      }
    });
  }

  // Create Stuff Tags
  console.log("🔗 Creating stuff tags...");
  for (let i = 0; i < stuffItems.length; i++) {
    const relevantTags = tags.filter(tag => 
      stuffItems[i].subject?.toLowerCase().includes(tag.name.toLowerCase()) ||
      (stuffItems[i].type === StuffType.STATIONERY && tag.name === "Stationery")
    );
    
    if (relevantTags.length > 0) {
      await prisma.stuffTag.create({
        data: {
          stuff_id: stuffItems[i].stuff_id,
          tag_id: relevantTags[0].tag_id
        }
      });
    }
  }

  // Create Offers
  console.log("💰 Creating offers...");
  const offers = [];
  
  for (let i = 0; i < stuffItems.length; i++) {
    const offerTypes = [OfferType.SELL, OfferType.LEND, OfferType.RENT, OfferType.SHARE];
    const offerType = offerTypes[i % offerTypes.length];
    
    const offer = await prisma.offer.create({
      data: {
        stuff_id: stuffItems[i].stuff_id,
        user_id: stuffItems[i].owner_id,
        offer_type: offerType,
        price: offerType === OfferType.SELL ? 200 + (i * 50) : undefined,
        rental_price_per_day: offerType === OfferType.RENT ? 10 + (i * 2) : undefined,
        rental_period_days: offerType === OfferType.RENT ? 7 + (i % 3) * 7 : undefined,
        security_deposit: offerType === OfferType.RENT ? 100 + (i * 20) : undefined,
        availability_start: new Date(),
        availability_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        is_active: true,
        quantity_available: 1,
        pickup_address: `Pickup Location ${i + 1}, Kolkata`,
        latitude: 22.5726 + (i * 0.001),
        longitude: 88.4639 + (i * 0.001),
        city: "Kolkata",
        state: "West Bengal",
        pincode: `70001${i % 10}`,
        visibility_scope: i % 2 === 0 ? "PUBLIC" : "COLLEGE",
        terms_conditions: "Please handle with care and return in same condition.",
        views_count: Math.floor(Math.random() * 20)
      }
    });
    offers.push(offer);
  }

  // Create Requests
  console.log("📝 Creating requests...");
  for (let i = 0; i < 5; i++) {
    await prisma.request.create({
      data: {
        user_id: users[i + 5].user_id,
        stuff_type: Object.values(StuffType)[i % Object.values(StuffType).length],
        title: `Looking for ${Object.values(StuffType)[i % Object.values(StuffType).length]} - Urgent`,
        description: `Need ${Object.values(StuffType)[i % Object.values(StuffType).length].toLowerCase()} for upcoming semester. Please contact if available.`,
        subject: ["Physics", "Chemistry", "Mathematics", "Computer Science"][i % 4],
        class_year: `${i + 1}st Year`,
        urgency_level: Object.values(UrgencyLevel)[i % Object.values(UrgencyLevel).length],
        needed_by_date: new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000),
        max_price: 300 + (i * 50),
        target_school_college_id: schoolsColleges[i % schoolsColleges.length].school_college_id,
        location_latitude: 22.5726 + (i * 0.001),
        location_longitude: 88.4639 + (i * 0.001),
        search_radius_km: 5.0,
        status: RequestStatus.OPEN,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    });
  }

  // Create Trades
  console.log("🤝 Creating trades...");
  for (let i = 0; i < 3; i++) {
    const tradeStatuses = [TradeStatus.PENDING, TradeStatus.ACCEPTED, TradeStatus.COMPLETED];
    const trade = await prisma.trade.create({
      data: {
        offer_id: offers[i].offer_id,
        borrower_id: users[i + 3].user_id,
        lender_id: offers[i].user_id,
        start_date: new Date(),
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        agreed_price: offers[i].price || offers[i].rental_price_per_day,
        security_deposit: offers[i].security_deposit,
        status: tradeStatuses[i % tradeStatuses.length],
        pickup_code: `PICKUP_${1000 + i}`,
        return_code: `RETURN_${2000 + i}`,
        borrower_notes: `Looking forward to using this ${stuffItems[i].title}`,
        lender_notes: "Please take good care of the item"
      }
    });

    // Create Transaction for completed trades
    // if (trade.status === TradeStatus.COMPLETED) {
    //   await prisma.transaction.create({
    //     data: {
    //       trade_id: trade.trade_id,
    //       user_id: trade.borrower_id,
    //       amount: trade.agreed_price || 100,
    //       currency: "INR",
    //       type: "RENT",
    //       status: TransactionStatus.COMPLETED,
    //       completed_at: new Date()
    //     }
    //   });
    // }
  }

  // Create Reviews
  console.log("⭐ Creating reviews...");
  for (let i = 0; i < 5; i++) {
    await prisma.review.create({
      data: {
        reviewer_id: users[i].user_id,
        target_user_id: users[i + 1].user_id,
        stuff_id: stuffItems[i].stuff_id,
        rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
        title: `Great ${stuffItems[i].type.toLowerCase()}!`,
        message: `Really helpful ${stuffItems[i].title}. Owner was very cooperative and the item was in excellent condition.`,
        type: ReviewType.UNIVERSAL_STUFF,
        is_helpful_count: Math.floor(Math.random() * 10)
      }
    });
  }

  // Create Thank you reviews
  for (let i = 0; i < 3; i++) {
    await prisma.review.create({
      data: {
        reviewer_id: users[i + 2].user_id,
        target_user_id: users[i].user_id,
        rating: 5,
        message: `Thank you so much for lending me the book! It really helped me with my studies. Highly recommend this person for trading.`,
        type: ReviewType.THANK_YOU_MESSAGE,
        is_helpful_count: Math.floor(Math.random() * 5)
      }
    });
  }

  // Create Messages
  console.log("💬 Creating messages...");
  for (let i = 0; i < 6; i++) {
    await prisma.message.create({
      data: {
        sender_id: users[i].user_id,
        receiver_id: users[i + 1].user_id,
        offer_id: offers[i % offers.length].offer_id,
        subject: `Inquiry about ${stuffItems[i % stuffItems.length].title}`,
        text: `Hi! I'm interested in your ${stuffItems[i % stuffItems.length].title}. Is it still available? When can we arrange pickup?`,
        is_read: i % 2 === 0,
      }
    });
  }

  // Create Reminders
  console.log("⏰ Creating reminders...");
  for (let i = 0; i < 4; i++) {
    await prisma.reminder.create({
      data: {
        user_id: users[i].user_id,
        title: `Return ${stuffItems[i].title}`,
        message: `Don't forget to return "${stuffItems[i].title}" to ${users[i + 1].profile?.full_name}. Due date is approaching!`,
        due_date: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000),
        type: ReminderType.RETURN_DUE,
        is_sent: i % 2 === 0
      }
    });
  }

  // Create Activities
  console.log("📊 Creating activities...");
  const activityTypes = ["OFFER_CREATED", "TRADE_COMPLETED", "REVIEW_WRITTEN", "STUFF_ADDED", "REQUEST_POSTED"];
  
  for (let i = 0; i < 10; i++) {
    await prisma.activity.create({
      data: {
        user_id: users[i].user_id,
        action_type: activityTypes[i % activityTypes.length],
        entity_type: i % 2 === 0 ? "STUFF" : "TRADE",
        entity_id: i % 2 === 0 ? stuffItems[i % stuffItems.length].stuff_id : offers[i % offers.length].offer_id,
        description: `User performed ${activityTypes[i % activityTypes.length].toLowerCase().replace('_', ' ')}`,
        metadata: {
          additional_info: `Activity ${i + 1} details`,
          timestamp: new Date().toISOString()
        }
      }
    });
  }

  // Create Notifications
  console.log("🔔 Creating notifications...");
  const notificationTypes = Object.values(NotificationType);
  
  for (let i = 0; i < 8; i++) {
    await prisma.notification.create({
      data: {
        user_id: users[i].user_id,
        type: notificationTypes[i % notificationTypes.length],
        title: `New ${notificationTypes[i % notificationTypes.length].toLowerCase().replace('_', ' ')}`,
        body: `You have a new ${notificationTypes[i % notificationTypes.length].toLowerCase().replace('_', ' ')} notification.`,
        data: {
          entity_id: stuffItems[i % stuffItems.length].stuff_id,
          action_url: `/stuff/${stuffItems[i % stuffItems.length].stuff_id}`
        },
        is_read: i % 3 === 0
      }
    });
  }

  // Create Stuff Favorites
  console.log("❤️ Creating favorites...");
  for (let i = 0; i < 6; i++) {
    await prisma.stuffFavorite.create({
      data: {
        user_id: users[i].user_id,
        stuff_id: stuffItems[(i + 3) % stuffItems.length].stuff_id
      }
    });
  }

  // Create Search Analytics
  console.log("🔍 Creating search analytics...");
  const searchQueries = ["physics books", "calculator", "literature", "chemistry notes", "stationery", "engineering"];
  
  for (let i = 0; i < searchQueries.length; i++) {
    await prisma.searchAnalytics.create({
      data: {
        user_id: users[i % users.length].user_id,
        search_query: searchQueries[i],
        stuff_type: i % 2 === 0 ? StuffType.BOOK : StuffType.STATIONERY,
        location: "Kolkata, West Bengal",
        results_count: Math.floor(Math.random() * 20) + 1,
        clicked_offer_id: offers[i % offers.length].offer_id
      }
    });
  }

  console.log("✅ Vidyarth Seed completed successfully!");
  console.log(`Created:
  - ${users.length} users with profiles
  - ${schoolsColleges.length} schools/colleges  
  - ${tags.length} tags
  - ${stuffItems.length} stuff items
  - ${offers.length} offers
  - 5 requests
  - 3 trades with transactions
  - 8 reviews
  - 6 messages
  - 4 reminders
  - 10 activities
  - 8 notifications
  - 6 favorites
  - ${searchQueries.length} search analytics entries`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error("❌ Seed failed: ", err);
    prisma.$disconnect();
  });