import { Alert } from 'react-native'
export default {
  Confirm : (title, text, no_text, yes_text) => {
        return new Promise((rs, rj) => {
            Alert.alert(
                title,
                text,
                [
                    {
                        text: no_text || "No",
                        onPress: () => {
                            console.log("Cancel Pressed")
                            rs(false);
                        },
                        style: "cancel"
                    },
                    {
                        text: yes_text || "Yes", onPress: () => {
                            rs(true);
                        }
                    }
                ],
                { cancelable: false }
            );
        });
    },
    Alert: (title, text, ok_text) => {
        return new Promise((rs, rj) => {
            Alert.alert(
                title,
                text,
                [
                    {
                        text: ok_text || "OK", onPress: () => {
                            rs(true);
                        }
                    }
                ],
                { cancelable: false }
            );
        });
    }
}