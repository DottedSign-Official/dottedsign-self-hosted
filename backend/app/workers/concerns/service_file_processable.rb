module ServiceFileProcessable
  def obtain_ids_from_service_file(service_file)
    case service_file.storable_type
    when 'SignTask'
      { task_id: service_file.storable_id }
    when 'SignStage'
      { task_id: service_file.storable.sign_task_id, stage_id: service_file.storable_id }
    when 'DummyStage'
      if service_file.storable.source_type == 'SignTask'
        { task_id: service_file.storable.source_id, stage_id: service_file.storable_id }
      end
    end
  end
end
