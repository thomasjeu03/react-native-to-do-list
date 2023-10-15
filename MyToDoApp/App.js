import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, TextInput, Button, FlatList, Switch, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedTasks = await AsyncStorage.getItem('tasks');
        if (savedTasks !== null) {
          setTasks(JSON.parse(savedTasks));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des tâches : ', error);
      }
    };
    loadTasks();
  }, []);

  const addTask = () => {
    if (task) {
      const newTask = { text: task, key: Date.now(), selected: false };
      setTasks([...tasks, newTask]);
      saveTasks([...tasks, newTask]);
      setTask('');
    }
  };

  const toggleTask = (key) => {
    const updatedTasks = tasks.map(task => {
      if (task.key === key) {
        task.selected = !task.selected;
      }
      return task;
    });
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const deleteTasks = () => {
    const updatedTasks = tasks.filter(task => !task.selected);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const saveTasks = async (tasksToSave) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasksToSave));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des tâches : ', error);
    }
  };

  return (
      <View style={styles.container}>
        <Text
            style={styles.container.h1}
        >Sexy To Do 🤭</Text>
        <Text style={styles.container.miniText}>
          Préparez le programme de votre soirée ❤️‍🔥
        </Text>
        <View style={styles.containerSearch}>
          <TextInput
              style={styles.input}
              placeholder="Ajoutez une position à pratiquer"
              value={task}
              onChangeText={text => setTask(text)}
          />
          {task.length > 0 && (
              <TouchableOpacity style={styles.AddButton} onPress={addTask}>
                <Icon name="plus-square" size={20} color="#0055FF" />
                <Text style={styles.AddButton.text}>Ajouter</Text>
              </TouchableOpacity>
          )}
        </View>

        {tasks.length > 0 && (
            <Text
                style={styles.container.h2}
            >Cocher si pratiqué</Text>
        )}
        <FlatList
            style={styles.flatList}
            data={tasks}
            renderItem={({ item }) => (
                <>
                  <View style={styles.flatList.task}>
                    <View style={styles.flatList.task.left}>
                      <Text>{item.text}</Text>
                      {item.selected && (<Text>🍑</Text>)}
                    </View>
                    <Switch
                        value={item.selected}
                        onValueChange={() => toggleTask(item.key)}
                    />
                  </View>
                </>
            )}
        />
        {tasks.some(task => task.selected) && (
            <TouchableOpacity style={styles.button} onPress={deleteTasks}>
              <Icon name="trash" size={20} color="red" />
              <Text style={styles.button.text}>Supprimer les tâches sélectionnées</Text>
            </TouchableOpacity>
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3e4f3',
    alignItems: 'flex-start',
    padding: 10,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'center',
    h1: {
      fontWeight: 'bold',
      fontSize: 28,
    },
    miniText: {
      color: '#675c67',
    },
    h2: {
      fontWeight: 'bold',
      fontSize: 20,
      marginTop: 20,
      marginBottom: 10,
    },
  },
  containerSearch: {
    width: '100%',
    display: "flex",
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  input: {
    width: '100%',
    borderWidth: 2,
    borderRadius: 8,
    borderColor: '#45454d',
    padding: 12,
    marginTop: 16,
    backgroundColor: '#e9e9ec',
  },
  AddButton: {
    display: "flex",
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 8,
    width: 'auto',
    text : {
      color: '#0055FF',
      fontSize: 16,
    }
  },
  button : {
    display: "flex",
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 12,
    text : {
      color: 'red',
      fontSize: 16,
    }
  },
  flatList: {
    width: '100%',
    height: 'auto',
    task: {
      width: '100%',
      color: '#e9e9ec',
      borderRadius: 8,
      padding: 8,
      marginTop: 8,
      display: "flex",
      flexDirection: 'row',
      gap: 8,
      borderWidth: '2',
      borderColor: '#ad98ad',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#e9e9ec',
      left: {
        display: "flex",
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
        justifyContent: 'space-between',
      }
    },
  },
});
