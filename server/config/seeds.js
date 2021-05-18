const db = require('./connection');
const { WalkerJob, Comment, Job, Rating, Dog, User } = require('../models');

db.once('open', async () => {
  
  await WalkerJob.deleteMany();
  await Comment.deleteMany();
  await Job.deleteMany();
  await Rating.deleteMany();
  await Dog.deleteMany();
  await User.deleteMany();


  await User.create({
    firstName: 'Pamela',
    lastName: 'Washington',
    email: 'pamela@testmail.com',
    password: 'password12345',
    address: '105 Eastwod Ave. Sacarborough M1N 3H4',
    description: 'Loves cats more than dogs!',
    image: './images/user1.JPG',
    type: 'Dog Owner'/*,
    orders: [
      {
        jobs: [jobs[0]._id]
      }
    ]*/
  });

  await User.create({
    firstName: 'Elijah',
    lastName: 'Holt',
    email: 'eholt@testmail.com',
    password: 'password12345',
    address: '103 Eastwod Ave. Sacarborough M1N 3H4',
    description: 'Loves dogs!',
    image: './images/user1.JPG',
    type: 'Dog Owner'
  });

  await User.create({
    firstName: 'Max',
    lastName: 'Ryan',
    email: 'mryan@testmail.com',
    password: 'password12345',
    address: '100 Eastwod Ave. Sacarborough M1N 3H4',
    description: 'Loves wolves!',
    image: './images/user1.JPG',
    type: 'Dog Walker'
  });

  console.log('users seeded');
  const users = await User.find();


  await Dog.create({
    user_id: users[0]._id,
    name: 'Doggy1',
    description: 'white dog',
    image: './images/user1.JPG',
    breed: 'Unknown'
  });

  await Dog.create({
    user_id: users[1]._id,
    name: 'Doggy2',
    description: 'brown dog',
    image: './images/user1.JPG',
    breed: 'Unknown'
  });

  console.log('dogs seeded');

  await Job.create({
    title: 'title 01',
    user_id: users[0]._id,
    description: 'walk my white dog',
    price: 7.00,
    date: '06-06-2021',
    status: 'Live'
  });

  await Job.create({
    title: 'title 02',
    user_id: users[1]._id,
    description: 'walk my brown dog',
    price: 8.00,
    date: '07-06-2021',
    status: 'Live'
  });
 
  await Job.create({
    title: 'title 03',
    user_id: users[1]._id,
    description: 'walk my black dog',
    price: 5.00,
    date: '07-02-2021',
    status: 'Inactive'
  });

  console.log('jobs seeded');
  const jobs = await Job.find();

  await WalkerJob.create({
    walker_id: users[2]._id,
    job_id: jobs[0]._id,
    apply: 1,
    select: 0
  });

  await WalkerJob.create({
    walker_id: users[2]._id,
    job_id: jobs[1]._id,
    apply: 1,
    select: 1
  });

  console.log('WalkerJob seeded');

  
  let newrating = await Rating.create(
    { rater_id: users[0]._id,
      rated_id: users[1]._id,
      ratingNb: 4,
      text: "Great Job"
    }
  );
  await User.findByIdAndUpdate(newrating.rater_id, { $push: { doneRatings: newrating._id } });
  await User.findByIdAndUpdate(newrating.rated_id, { $push: { receivedRatings: newrating._id } });

   newrating = await Rating.create(
    { rater_id: users[1]._id,
      rated_id: users[2]._id,
      ratingNb: 5,
      text: "Excellent"
    }
  );
  await User.findByIdAndUpdate(newrating.rater_id, { $push: { doneRatings: newrating._id } });
  await User.findByIdAndUpdate(newrating.rated_id, { $push: { receivedRatings: newrating._id } });

   newrating = await Rating.create(
    { rater_id: users[1]._id,
      rated_id: users[0]._id,
      ratingNb: 3,
      text: "was really nice"
    }
  );
  await User.findByIdAndUpdate(newrating.rater_id, { $push: { doneRatings: newrating._id } });
  await User.findByIdAndUpdate(newrating.rated_id, { $push: { receivedRatings: newrating._id } });

   newrating = await Rating.create(
    { rater_id: users[2]._id,
      rated_id: users[0]._id,
      ratingNb: 5,
      text: "Hope to see them again"
    }
  );
  await User.findByIdAndUpdate(newrating.rater_id, { $push: { doneRatings: newrating._id } });
  await User.findByIdAndUpdate(newrating.rated_id, { $push: { receivedRatings: newrating._id } });




  console.log('Rating seeded');


  process.exit();
});
