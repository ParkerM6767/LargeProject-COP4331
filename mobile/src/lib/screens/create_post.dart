import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import '../providers/location_service.dart';
import '../providers/api_service.dart';

class AddPostScreen extends StatelessWidget {
  final titleController = TextEditingController();
  final latController = TextEditingController();
  final longController = TextEditingController();
  final descController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Create New Event")),
      body: ListView(
        padding: EdgeInsets.all(16),
        children: [
          TextField(controller: titleController, decoration: InputDecoration(labelText: "Title")),
          TextField(controller: latController, decoration: InputDecoration(labelText: "Latitude"), keyboardType: TextInputType.number, readOnly: true),
          TextField(controller: longController, decoration: InputDecoration(labelText: "Longitude"), keyboardType: TextInputType.number, readOnly: true),
          TextField(controller: descController, decoration: InputDecoration(labelText: "Description"), maxLines: 3),
          SizedBox(height: 20),
          ElevatedButton(
            onPressed: () async {
              // Call ApiService.createPost
              // use geolocator to get coordinates
              Position currentPosition = await determinePosition();
              latController.text = currentPosition.latitude.toString();
              longController.text = currentPosition.longitude.toString();

              ApiService().createPost(titleController.text, 28.602390805068765, -81.19893873831073, descController.text);
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color.fromARGB(255, 49, 155, 255),
              foregroundColor: Colors.white,
            ),
            child: Text("Create"),
          ),
        ],
      ),
    );
  }
}