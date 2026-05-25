class XfdfExporterWorker < GeneralWorker
  def perform(source_type, source_id, stage_ids=nil)
    export = KmpdfTool::XfdfExporter.call(source_type, source_id, stage_ids)
    raise export.error if export.failed?
  ensure
    FileUtils.rm_rf(export.working_dir) if export.working_dir.present?
  end
end
