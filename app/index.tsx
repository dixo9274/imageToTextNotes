// import { Redirect } from "expo-router";
// import { Text } from "@rneui/themed";
// import { View } from "react-native";
// import React from "react";

// export default function IndexPage() {
//   return <Redirect href={"/(tabs)/index"} />;
//   // return <Redirect href={"/(auth)/login"} />;
// }

// const index = () => {
//   return (
//     <View>
//       <Text>index</Text>
//     </View>
//   );
// };

// export default index;

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
// import Auth from '../components/Auth'
// import Account from '../components/Account'
import { View } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { router, useNavigation } from 'expo-router'
import { Navigator } from 'expo-router'


export default function App() {
  // const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/(tabs)/Home")
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace("/(tabs)/Home")
      }
      else {
        router.replace("/(auth)/login")
      }
    });
  }, []);

  // return (
  //   <View>
  //     {session && session.user ? <Account key={session.user.id} session={session} /> : <Auth />}
  //   </View>
  // )
}
// import { useState, useEffect } from 'react'
// import { supabase } from '../lib/supabase'
// import Auth from '../components/Auth'
// import Account from '../components/Account'
// import { View } from 'react-native'
// import { Session } from '@supabase/supabase-js'
// import { Redirect, router } from 'expo-router'

// export default function App() {
//   const [session, setSession] = useState<Session | null>(null)

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session)
//     })

//     supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session)
//     })
//   }, [])

//   return (
//     <View>
//       {session && session.user ? <Account key={session.user.id} session={session} /> : <Auth />}
//     </View>
//   )
// }