 ## Примеры запросов 

# При проверке работы приложения использовалось расширение GraphQL Playground for Chrome. Ниже приведены примеры запросов. Обратите внимание, что Вы можете добавлять поля в результаты ответа. В приведенных примерах запрашиваются минимальные данные. ID необходимо подставлять реальный

   * Get gql requests:  
   # 2.1. Get users, profiles, posts, memberTypes - 4 operations in one query.  

      query {
      usersProfilesPostsMembers{
         users{
            id
         }
         memberTypes{
            id
         }
         profiles{
            id
         }
         posts{
            id
         }
      }
      }


  # 2.2. Get user, profile, post, memberType by id - 4 operations in one query.  

      query {
      userProfilePostMemberById(input: 
         {
            id:"ffb0904e-ea47-4edf-84d3-2737767b57e4"
         }){
         user{
            id
         }
         profile{
            id
         }
         post{
            id
         }
            memberTypes{
            id
            }
         }
      }


   # 2.3. Get users with their posts, profiles, memberTypes.  

         query {
         usersWithPostsProfileMemberType{
            users{
               id
               posts{
               title
               }
               profile{
               id
               }
               memberType{
               id
               }
            }
           }
         }


   # 2.4. Get user by id with his posts, profile, memberType.  

      query {
      userWithPostsProfileMemberType(input: 
         {
            id:"73984d8c-97d4-402d-92f1-fb4b5927a1b7",  
         }){
         user{
            id
            posts{
            title
            content
            }
            profile{
            id
            }
            memberType{
            id
            }
         }
      }
   }
  
   # 2.5. Get users with their `userSubscribedTo`, profile.  

      query {
      usersWithProfileUserSubscribedTo{
         users{
            id
            profile{
            id
            }
            userSubscribedTo{
            id
            }
         }
      }

   # 2.6. Get user by id with his `subscribedToUser`, posts.  

         query {
      userWithPostsSubscribedToUserById(input: 
         {
            id:"ffb0904e-ea47-4edf-84d3-2737767b57e4"
         })
      {
         user{
            id
            posts{
               id
            }
            userSubscribedTo{
            id
            }
         }
      }
      }

   * Create gql requests: 

   # 2.8. Create user.  

      mutation CreateUser {
      createUser (input: 
         {
            firstName: "Ivan",
            lastName: "Ivanov",
            email: "Ivanov@gmail.com"
         }) {
            id
            firstName
            lastName
         }
      }

   # 2.9. Create profile.  

         mutation CreateProfile {
      createProfile (input: 
         {
            userId: "73984d8c-97d4-402d-92f1-fb4b5927a1b7", 
            sex: "female",
            avatar: "hero",
            birthday: 30,
            country: "Canada",
            street: "Green",
            city: "Capital",
            memberTypeId: "basic"
         }) {
            id
            sex
            avatar
            birthday
            country
            street
            city
            memberTypeId
         }
      }

   # 2.10. Create post.  

     mutation CreatePost {
      createPost (input: 
         {
            userId: "73984d8c-97d4-402d-92f1-fb4b5927a1b7", 
            title: "Post1",
            content: "Text"
         }) {
            id
            title
            content
         }
      }

   * Update gql requests:  
   # 2.12. Update user. 

      mutation UpdateUser {
      updateUser(
         input: {
            userId: "73984d8c-97d4-402d-92f1-fb4b5927a1b7"
            firstName: "Ben"
            lastName: "Smith"
            email: "Smith@gmail.com"
         }
      ) {
         id
         firstName
         lastName
      }
      }


   # 2.13. Update profile.  

         mutation UpdateProfile {
      updateProfile(
         input: {
            profileId: "38118801-e79f-4fd2-9a30-d87d80695af8"
            sex: "male"
            avatar: "hero1"
            birthday: 301
            country: "Canada1"
            street: "Green1"
            city: "Capital1"
            memberTypeId: "basic"
         }
      ) {
         id
         sex
         avatar
         birthday
         country
         street
         city
         memberTypeId
      }
      }

   # 2.14. Update post.  

         mutation UpdatePost {
      updatePost(
         input: {
            postId: "a70b703b-693e-466d-88f5-14aba0240d2c"
            title: "Post2"
            content: "Text2"
         }
      ) {
         id
         title
         content
      }
      }

   # 2.15. Update memberType.  

         mutation UpdateMemberType {
      updateMemberType(
         input: { memberTypeId: "basic", discount: 20, monthPostsLimit: 20 }
      ) {
         id
         discount
         monthPostsLimit
      }
      }

   # 2.16. 
   
   # Subscribe to

         mutation subscribeTo {
      subscribeTo (input: 
         {
            userId: "80ddb579-04a5-4088-8f25-2cece920dad1",
            userIdSubscribeTo: "94cc9a4a-55ea-4052-b314-3b9982788efb",
         }) {
         id
         firstName
         lastName
      }
      }


 
   
   # unsubscribe from

         mutation unsubscribeFrom {
      unsubscribeFrom (input: 
         {
            userId: "80ddb579-04a5-4088-8f25-2cece920dad1",
            userIdunsubscribeFrom: "94cc9a4a-55ea-4052-b314-3b9982788efb",
         }) {
         id
         firstName
         lastName
      }
      }


 