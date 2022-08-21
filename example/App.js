import { SafeAreaView } from 'react-native';

import CodeEditor from '@zard-tech/rn-code'

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CodeEditor 
        initialValue="Hello, world!"
      />
    </SafeAreaView>
  );
}
